import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { email, password, firstName, lastName } = await req.json();

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: "Tous les champs sont requis." },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Un compte avec cet email existe déjà." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });

        // Send welcome email (fire and forget)
        sendWelcomeEmail(email, firstName).catch(console.error);

        return NextResponse.json(
            { message: "Compte créé avec succès.", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue." },
            { status: 500 }
        );
    }
}
