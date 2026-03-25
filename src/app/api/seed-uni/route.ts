import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    // 1. Security Gate: Verify the secret key from the URL
    const { searchParams } = new URL(request.url);
    const providedSecret = searchParams.get("secret");
    const requiredSecret = process.env.UNIVERSITY_SEED_SECRET;

    if (!requiredSecret || providedSecret !== requiredSecret) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing seed secret." }, 
        { status: 401 }
      );
    }

    const email = "admin@university.edu";
    // 2. Pull the password securely from the .env file
    const password = process.env.UNIVERSITY_ADMIN_PASSWORD;

    if (!password) {
      return NextResponse.json(
        { error: "Server Configuration Error: Missing Admin Password in .env" }, 
        { status: 500 }
      );
    }

    // 3. Check for existing account
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "University account is already provisioned." });
    }

    // 4. Hash and Inject
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        fullName: "UP College of Dentistry",
        role: "university",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "University provisioned successfully. You may now log in.",
      email: email
      // Notice we do NOT return the password in the JSON response for security
    });
  } catch (error) {
    return NextResponse.json({ error: "Injection failed" }, { status: 500 });
  }
}