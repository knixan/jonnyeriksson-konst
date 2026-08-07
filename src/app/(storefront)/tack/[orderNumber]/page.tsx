import { notFound } from "next/navigation";

import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

export default async function OrderConfirmationPage(
  props: PageProps<"/tack/[orderNumber]">,
) {
  const { orderNumber } = await props.params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const swishPhone = settings?.contact?.swishPhone;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <ClearCartOnMount />
      <h1 className="text-4xl text-foreground">Tack för din beställning!</h1>
      <p className="mt-2 text-muted-foreground">
        Ordernummer: {order.orderNumber}
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-border py-2 text-sm"
          >
            <span className="text-primary">
              {item.productName} ({item.variantLabel}) × {item.quantity}
            </span>
            <span className="text-foreground">
              {formatPrice(item.lineTotalOre)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>Frakt</span>
          <span>{formatPrice(order.shippingOre)}</span>
        </div>
        <div className="mt-1 flex justify-between text-lg">
          <span className="text-primary">Totalt</span>
          <span className="text-foreground">{formatPrice(order.totalOre)}</span>
        </div>
      </div>

      {order.paymentMethod === "SWISH" ? (
        <div className="mt-8 rounded-md bg-secondary px-6 py-5 text-secondary-foreground">
          <h2 className="text-lg text-foreground">Betala med Swish</h2>
          <p className="mt-2 text-sm">
            Swisha <strong>{formatPrice(order.totalOre)}</strong> till{" "}
            <strong>
              {swishPhone || "(Swish-nummer ej konfigurerat ännu)"}
            </strong>{" "}
            och ange <strong>{order.orderNumber}</strong> som meddelande. Vi
            bekräftar din betalning så snart den kommit in.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-md bg-secondary px-6 py-5 text-secondary-foreground">
          <p className="text-sm">
            {order.paymentStatus === "PAID"
              ? "Din betalning är bekräftad."
              : "Vi bekräftar din betalning inom kort."}
          </p>
        </div>
      )}
    </div>
  );
}
