"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  paymentMethod: z.enum(["STRIPE", "SWISH"]),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

type ActionResult = { error: string };

function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JE-${datePart}-${randomPart}`;
}

export async function createOrder(
  input: CheckoutInput,
): Promise<ActionResult | void> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Formuläret innehåller fel. Kontrollera dina uppgifter." };
  }
  const data = parsed.data;

  if (data.paymentMethod === "STRIPE" && !stripe) {
    return { error: "Stripe är inte konfigurerat ännu. Välj Swish istället." };
  }

  const variantIds = data.items.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  const lineItems = data.items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || !variant.inStock) return null;
    return {
      variantId: variant.id,
      productName: variant.product.name,
      variantLabel: variant.framed ? `${variant.size}, inramad` : variant.size,
      unitPriceOre: variant.priceOre,
      quantity: item.quantity,
      lineTotalOre: variant.priceOre * item.quantity,
    };
  });

  if (lineItems.some((item) => item === null) || lineItems.length === 0) {
    return {
      error:
        "Ett eller flera konstverk i varukorgen är inte längre tillgängliga.",
    };
  }
  const items = lineItems as NonNullable<(typeof lineItems)[number]>[];

  const subtotalOre = items.reduce((sum, item) => sum + item.lineTotalOre, 0);
  const shippingSettings = await prisma.shippingSettings.findUnique({
    where: { id: 1 },
  });
  const flatRateOre = shippingSettings?.flatRateOre ?? 0;
  const freeThreshold = shippingSettings?.freeShippingThresholdOre;
  const shippingOre =
    freeThreshold && subtotalOre >= freeThreshold ? 0 : flatRateOre;
  const totalOre = subtotalOre + shippingOre;

  const orderNumber = generateOrderNumber();

  // Originalmålningar finns bara i ett exemplar — markera dem som slutsålda
  // direkt när ordern läggs, oavsett betalningsmetod, så de inte kan köpas igen.
  const originalVariantIds = items
    .filter(
      (item) =>
        variants.find((v) => v.id === item.variantId)?.product.type ===
        "ORIGINAL",
    )
    .map((item) => item.variantId);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        postalCode: data.postalCode,
        city: data.city,
        subtotalOre,
        shippingOre,
        totalOre,
        paymentMethod: data.paymentMethod,
        items: { create: items },
      },
    });

    if (originalVariantIds.length > 0) {
      await tx.productVariant.updateMany({
        where: { id: { in: originalVariantIds } },
        data: { inStock: false },
      });
    }

    return createdOrder;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (data.paymentMethod === "STRIPE" && stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "sek",
          unit_amount: item.unitPriceOre,
          product_data: { name: `${item.productName} – ${item.variantLabel}` },
        },
      })),
      shipping_options: shippingOre
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: shippingOre, currency: "sek" },
                display_name: "Frakt",
              },
            },
          ]
        : undefined,
      success_url: `${siteUrl}/tack/${orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/kassa`,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    if (!session.url) {
      return { error: "Kunde inte starta Stripe-betalningen. Försök igen." };
    }

    redirect(session.url);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { swishReference: orderNumber },
  });

  redirect(`/tack/${orderNumber}`);
}
