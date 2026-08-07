import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const paymentStatusLabel: Record<string, string> = {
  PENDING: "Ej betald",
  PAID: "Betald",
  CANCELLED: "Avbruten",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl text-foreground">Beställningar</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Kund</TableHead>
            <TableHead>Betalning</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Summa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/admin/bestallningar/${order.id}`}
                  className="text-primary hover:text-accent"
                >
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.paymentStatus === "PAID" ? "default" : "outline"
                  }
                >
                  {order.paymentMethod === "SWISH" ? "Swish" : "Kort"} –{" "}
                  {paymentStatusLabel[order.paymentStatus]}
                </Badge>
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{formatPrice(order.totalOre)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
