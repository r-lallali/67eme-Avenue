import "server-only";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface OrderItemEmail {
    name: string;
    size: string;
    quantity: number;
    price: number;
}

interface OrderEmail {
    id: string;
    items: OrderItemEmail[];
    total: number;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
        phone: string;
    };
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey || apiKey === "ta-clé-api-brevo") {
        console.warn("[Brevo] Clé API non configurée, email non envoyé.");
        return;
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@ralys-shop.com";
    const senderName = process.env.BREVO_SENDER_NAME || "Ralys Shop";

    const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": apiKey,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: to }],
            subject,
            htmlContent,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Brevo API error: ${response.status} — ${error}`);
    }

    console.log(`[Brevo] Email envoyé à ${to}: "${subject}"`);
}

// ─── Welcome Email ───

export async function sendWelcomeEmail(email: string, firstName: string) {
    const subject = "Bienvenue chez Ralys Shop ✨";

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="padding: 48px 32px; text-align: center;">
            <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.05em; color: #000000; margin-bottom: 32px;">
                RALYS SHOP
            </h1>
            <div style="width: 40px; height: 1px; background: #000000; margin: 0 auto 32px;"></div>
            <h2 style="font-size: 22px; font-weight: 300; color: #000000; margin-bottom: 24px;">
                Bienvenue, ${firstName} !
            </h2>
            <p style="font-size: 15px; color: #6b7280; line-height: 1.8; margin-bottom: 32px;">
                Merci d'avoir créé votre compte. Vous pouvez dès maintenant découvrir nos collections
                et profiter de toutes les nouveautés.
            </p>
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/collections/all"
               style="display: inline-block; padding: 16px 48px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em;">
                DÉCOUVRIR LA BOUTIQUE
            </a>
        </div>
        <div style="padding: 24px 32px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © ${new Date().getFullYear()} Ralys Shop. Tous droits réservés.
            </p>
        </div>
    </div>`;

    await sendEmail(email, subject, htmlContent);
}

// ─── Order Confirmation Email ───

export async function sendOrderConfirmationEmail(
    email: string,
    firstName: string,
    order: OrderEmail
) {
    const subject = `Confirmation de commande #${order.id.slice(-8).toUpperCase()}`;

    const itemsHtml = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151;">
                    ${item.name}
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #6b7280; text-align: center;">
                    ${item.size}
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #6b7280; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: right;">
                    ${(item.price * item.quantity).toFixed(2)} €
                </td>
            </tr>`
        )
        .join("");

    const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="padding: 48px 32px; text-align: center;">
            <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.05em; color: #000000; margin-bottom: 32px;">
                RALYS SHOP
            </h1>
            <div style="width: 40px; height: 1px; background: #000000; margin: 0 auto 32px;"></div>
            <h2 style="font-size: 22px; font-weight: 300; color: #000000; margin-bottom: 16px;">
                Merci pour votre commande, ${firstName} !
            </h2>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                Commande <strong>#${order.id.slice(-8).toUpperCase()}</strong>
            </p>
        </div>

        <div style="padding: 0 32px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 12px 0; border-bottom: 2px solid #e5e7eb; font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em;">
                            ARTICLE
                        </th>
                        <th style="text-align: center; padding: 12px 0; border-bottom: 2px solid #e5e7eb; font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em;">
                            TAILLE
                        </th>
                        <th style="text-align: center; padding: 12px 0; border-bottom: 2px solid #e5e7eb; font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em;">
                            QTÉ
                        </th>
                        <th style="text-align: right; padding: 12px 0; border-bottom: 2px solid #e5e7eb; font-size: 12px; font-weight: 600; color: #9ca3af; letter-spacing: 0.05em;">
                            PRIX
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div style="text-align: right; margin-top: 24px; padding-top: 16px; border-top: 2px solid #000000; margin-bottom: 32px;">
                <span style="font-size: 16px; font-weight: 600; color: #000000;">
                    Total : ${order.total.toFixed(2)} €
                </span>
            </div>

            ${order.shippingAddress ? `
            <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 32px; text-align: left;">
                <h3 style="font-size: 14px; font-weight: 600; color: #000000; margin-top: 0; margin-bottom: 12px; letter-spacing: 0.05em; text-transform: uppercase;">
                    Livraison
                </h3>
                <p style="font-size: 14px; color: #374151; margin: 0 0 4px;">
                    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
                </p>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">
                    ${order.shippingAddress.address}
                </p>
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px;">
                    ${order.shippingAddress.zipCode} ${order.shippingAddress.city}, ${order.shippingAddress.country}
                </p>
                
                <h3 style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 16px 0 4px; letter-spacing: 0.05em; text-transform: uppercase;">
                    Délai estimé
                </h3>
                <p style="font-size: 14px; color: #10b981; font-weight: 500; margin: 0;">
                    5 à 7 jours ouvrés (Livraison Standard)
                </p>
            </div>
            ` : ''}
        </div>

        <div style="padding: 0 32px 32px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/orders/${order.id}"
               style="display: inline-block; padding: 16px 48px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; border-radius: 4px;">
                SUIVRE MA COMMANDE
            </a>
        </div>

        <div style="padding: 24px 32px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                © ${new Date().getFullYear()} Ralys Shop. Tous droits réservés.
            </p>
        </div>
    </div>`;

    await sendEmail(email, subject, htmlContent);
}
