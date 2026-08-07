import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, newOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl text-foreground">Översikt</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Produkter" value={productCount} />
        <StatCard label="Nya beställningar" value={newOrders} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg text-foreground">Senaste beställningar</h2>
          <Link
            href="/admin/bestallningar"
            className="text-sm text-primary hover:text-accent"
          >
            Visa alla →
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-border rounded-md border border-border">
          {recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Inga beställningar än.
            </p>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/bestallningar/${order.id}`}
                className="flex items-center justify-between p-4 text-sm hover:bg-secondary"
              >
                <span className="text-primary">
                  {order.orderNumber} — {order.customerName}
                </span>
                <span className="text-foreground">
                  {formatPrice(order.totalOre)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl text-foreground">{value}</p>
    </div>
  );
}
