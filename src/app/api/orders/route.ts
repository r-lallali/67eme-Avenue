import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";

interface OrderItemInput {
    productId: string;
    size: string;
    quantity: number;
}

export async function POST(req: Request) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Vous devez être connecté pour passer une commande." },
                { status: 401 }
            );
        }

        const { items } = (await req.json()) as { items: OrderItemInput[] };

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "Votre panier est vide." },
                { status: 400 }
            );
        }

        // Fetch product prices from DB (server-side security)
        const productIds = [...new Set(items.map((item) => item.productId))];
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));

        // Validate all products exist
        for (const item of items) {
            if (!productMap.has(item.productId)) {
                return NextResponse.json(
                    { error: `Produit introuvable : ${item.productId}` },
                    { status: 400 }
                );
            }
        }

        // Calculate total
        const total = items.reduce((sum, item) => {
            const product = productMap.get(item.productId)!;
            return sum + product.price * item.quantity;
        }, 0);

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                total,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        size: item.size,
                        quantity: item.quantity,
                        price: productMap.get(item.productId)!.price,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        // Get user info for email
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        // Send order confirmation email (fire and forget)
        if (user) {
            sendOrderConfirmationEmail(user.email, user.firstName, {
                id: order.id,
                total: order.total,
                items: order.items.map((item) => ({
                    name: item.product.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }).catch(console.error);
        }

        return NextResponse.json(
            {
                message: "Commande créée avec succès.",
                orderId: order.id,
                total: order.total,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Une erreur est survenue lors de la création de la commande." },
            { status: 500 }
        );
    }
}
