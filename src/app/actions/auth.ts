"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  patientBasicInfoSchema,
  patientConcernSchema,
  patientLocationSchema,
  studentAcademicSchema,
  studentClinicSchema,
} from "@/lib/auth-schemas";
import type { UserRole } from "@/lib/role-context";

/* ─────────────────────────────────────────────
 * Auth Server Actions - Production-ready
 * Login: verifies credentials, returns role from DB (silent detection)
 * Register: persists user with role to database
 * ───────────────────────────────────────────── */

export interface LoginResult {
  success: true;
  role: UserRole;
  user: { id: string; email: string; fullName: string };
}

export interface AuthError {
  success: false;
  error: string;
}

export type LoginResponse = LoginResult | AuthError;

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return { success: false, error: "Incorrect email or password." };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { success: false, error: "Incorrect email or password." };
    }

    const role = user.role as UserRole;
    if (role !== "student" && role !== "patient") {
      return { success: false, error: "Invalid user role. Please contact support." };
    }

    return {
      success: true,
      role,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  } catch (err) {
    console.error("[auth] Login error:", err);
    return {
      success: false,
      error: getAuthErrorMessage(err),
    };
  }
}

export interface RegisterPayload {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  age?: string;
  phone?: string;
  concern?: string;
  location?: string;
  school?: string;
  yearLevel?: string;
  studentId?: string;
  username?: string;
  clinicAddress?: string;
  cases?: { id: number; name: string; count: number }[];
  availability?: Record<string, boolean>;
}

export type RegisterResponse =
  | { success: true; userId: string }
  | { success: false; error: string };

export async function registerAction(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  try {
    const { role, fullName, email, password } = payload;

    if (role !== "student" && role !== "patient") {
      return { success: false, error: "Invalid role." };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    if (role === "student" && payload.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: payload.username },
      });
      if (existingUsername) {
        return { success: false, error: "This username is already taken." };
      }
    }

    // Validate role-specific fields
    if (role === "student") {
      const academic = studentAcademicSchema.safeParse({
        fullName: payload.fullName,
        school: payload.school,
        yearLevel: payload.yearLevel,
        studentId: payload.studentId,
        username: payload.username,
        password: payload.password,
      });
      if (!academic.success) {
        const msg = academic.error.flatten().fieldErrors;
        const first = Object.values(msg).flat()[0];
        return { success: false, error: first ?? "Invalid student data." };
      }
      const clinic = studentClinicSchema.safeParse({
        clinicAddress: payload.clinicAddress,
      });
      if (!clinic.success) {
        const msg = clinic.error.flatten().fieldErrors;
        const first = Object.values(msg).flat()[0];
        return { success: false, error: first ?? "Invalid clinic address." };
      }
    } else {
      const basic = patientBasicInfoSchema.safeParse({
        fullName: payload.fullName,
        age: payload.age,
        phone: payload.phone,
        email: payload.email,
      });
      if (!basic.success) {
        const msg = basic.error.flatten().fieldErrors;
        const first = Object.values(msg).flat()[0];
        return { success: false, error: first ?? "Invalid patient data." };
      }
      const concern = patientConcernSchema.safeParse({ concern: payload.concern });
      if (!concern.success) {
        const msg = concern.error.flatten().fieldErrors;
        const first = Object.values(msg).flat()[0];
        return { success: false, error: first ?? "Invalid concern." };
      }
      const location = patientLocationSchema.safeParse({
        location: payload.location,
      });
      if (!location.success) {
        const msg = location.error.flatten().fieldErrors;
        const first = Object.values(msg).flat()[0];
        return { success: false, error: first ?? "Invalid location." };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName: fullName.trim(),
        role,
        age: payload.age ? parseInt(payload.age, 10) : null,
        phone: payload.phone ?? null,
        concern: payload.concern ?? null,
        location: payload.location ?? null,
        school: payload.school ?? null,
        yearLevel: payload.yearLevel ?? null,
        studentId: payload.studentId ?? null,
        username: payload.username ?? null,
        clinicAddress: payload.clinicAddress ?? null,
        casesJson: payload.cases
          ? JSON.stringify(payload.cases)
          : null,
        availabilityJson: payload.availability
          ? JSON.stringify(payload.availability)
          : null,
      },
    });

    return { success: true, userId: user.id };
  } catch (err) {
    console.error("[auth] Register error:", err);
    return {
      success: false,
      error: getAuthErrorMessage(err),
    };
  }
}

/** Extract user-friendly message from Prisma or generic errors */
function getAuthErrorMessage(err: unknown): string {
  const prismaErr = err as { code?: string; meta?: { target?: string[] } } | null;
  if (prismaErr && typeof prismaErr === "object" && typeof prismaErr.code === "string") {
    switch (prismaErr.code) {
      case "P2002": {
        const target = prismaErr.meta?.target;
        if (Array.isArray(target) && target.includes("email"))
          return "An account with this email already exists.";
        if (Array.isArray(target) && target.includes("username"))
          return "This username is already taken.";
        return "A record with this value already exists. Please use different information.";
      }
      case "P2003":
        return "Invalid reference. Please refresh and try again.";
      case "P2025":
        return "Record not found. Please refresh and try again.";
      default:
        return `Database error (${prismaErr.code}). Please try again or contact support.`;
    }
  }
  if (err instanceof Error && err.name?.includes("Prisma"))
    return "Invalid data. Please check your input and try again.";
  return "Something went wrong. Please try again.";
}
