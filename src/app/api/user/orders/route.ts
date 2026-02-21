import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                items: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error("Fetch user orders error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la récupération des commandes" },
            { status: 500 }
        );
    }
}
