import { z } from 'zod';

/* ─────────────────────────────────────────────
 * Role-aware Zod validation schemas for Dentara Auth
 * ───────────────────────────────────────────── */

/** Shared: email validation */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/** Shared: password validation (min 8 chars, at least one letter and one number) */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/** Login form schema — email/password only; role comes from DB (silent detection) */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Patient registration: Step 2 - Basic Info */
export const patientBasicInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.string().min(1, 'Age is required').refine((v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 120, 'Enter a valid age (1–120)'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: emailSchema,
  password: passwordSchema,
});

/** Patient registration: Step 3 - Concern */
export const patientConcernSchema = z.object({
  concern: z.string().min(10, 'Please describe your dental needs (at least 10 characters)'),
});

/** Patient registration: Step 4 - Location */
export const patientLocationSchema = z.object({
  location: z.string().min(2, 'Please enter your city or area'),
});

/** Student registration: Step 2 - Academic Info */
export const studentAcademicSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  school: z.string().min(2, 'Dental school is required'),
  yearLevel: z.string().min(1, 'Year level is required'),
  studentId: z.string().min(3, 'Student ID is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: passwordSchema,
});

/** Student registration: Step 5 - Clinic Location */
export const studentClinicSchema = z.object({
  clinicAddress: z.string().min(5, 'Please enter a complete clinic address'),
});
