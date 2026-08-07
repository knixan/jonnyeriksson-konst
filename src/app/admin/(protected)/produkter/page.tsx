import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Produkter</h1>
        <Button
          variant="cta"
          nativeButton={false}
          render={<Link href="/admin/produkter/ny" />}
        >
          Ny produkt
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Från pris</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const prices = product.variants.map((v) => v.priceOre);
            const fromPrice = prices.length ? Math.min(...prices) : null;
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <Link
                    href={`/admin/produkter/${product.id}`}
                    className="text-primary hover:text-accent"
                  >
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.category?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "ACTIVE" ? "default" : "outline"
                    }
                  >
                    {product.status === "ACTIVE" ? "Publicerad" : "Utkast"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {fromPrice !== null ? formatPrice(fromPrice) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
