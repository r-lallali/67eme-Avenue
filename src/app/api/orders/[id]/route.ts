import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { id: orderId } = await params;

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
        }

        // Security check: ensure user is the owner of the order
        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error("Fetch order error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la récupération de la commande" },
            { status: 500 }
        );
    }
}
