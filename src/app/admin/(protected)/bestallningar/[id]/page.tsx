import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

import { markOrderPaid, updateOrderStatus } from "../actions";

export default async function AdminOrderDetailPage(
  props: PageProps<"/admin/bestallningar/[id]">,
) {
  const { id } = await props.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">{order.orderNumber}</h1>
        <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"}>
          {order.paymentStatus}
        </Badge>
      </div>

      <section className="rounded-md border border-border p-4 text-sm">
        <h2 className="mb-2 text-foreground">Kund</h2>
        <p className="text-primary">{order.customerName}</p>
        <p className="text-muted-foreground">{order.customerEmail}</p>
        <p className="text-muted-foreground">{order.customerPhone}</p>
        <p className="mt-2 text-primary">
          {order.addressLine1}
          {order.addressLine2 ? `, ${order.addressLine2}` : ""}
        </p>
        <p className="text-primary">
          {order.postalCode} {order.city}, {order.country}
        </p>
      </section>

      <section className="rounded-md border border-border p-4 text-sm">
        <h2 className="mb-2 text-foreground">Varor</h2>
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-primary">
                {item.productName} ({item.variantLabel}) × {item.quantity}
              </span>
              <span className="text-foreground">
                {formatPrice(item.lineTotalOre)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 text-muted-foreground">
            <span>Frakt</span>
            <span>{formatPrice(order.shippingOre)}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Totalt</span>
            <span>{formatPrice(order.totalOre)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border p-4 text-sm">
        <h2 className="mb-2 text-foreground">Betalning</h2>
        <p className="text-primary">
          Metod:{" "}
          {order.paymentMethod === "SWISH" ? "Swish (manuell)" : "Stripe"}
        </p>
        {order.swishReference ? (
          <p className="text-muted-foreground">
            Referens: {order.swishReference}
          </p>
        ) : null}
        {order.paymentMethod === "SWISH" &&
        order.paymentStatus === "PENDING" ? (
          <form action={markOrderPaid.bind(null, order.id)} className="mt-3">
            <Button type="submit" variant="cta" size="sm">
              Markera som betald
            </Button>
          </form>
        ) : null}
      </section>

      <section className="rounded-md border border-border p-4 text-sm">
        <h2 className="mb-2 text-foreground">Orderstatus</h2>
        <form
          action={updateOrderStatus.bind(null, order.id)}
          className="flex items-center gap-3"
        >
          <select
            name="status"
            defaultValue={order.status}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="NEW">Ny</option>
            <option value="PROCESSING">Behandlas</option>
            <option value="SHIPPED">Skickad</option>
          </select>
          <Button type="submit" variant="outline" size="sm">
            Uppdatera
          </Button>
        </form>
      </section>
    </div>
  );
}
