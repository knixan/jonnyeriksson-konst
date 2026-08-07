import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
    include: { categories: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Produkter</h1>
        <Link
          href="/admin/produkter/ny"
          className={buttonVariants({ variant: "cta" })}
        >
          Ny produkt
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Namn</TableHead>
            <TableHead>Kategorier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Från pris</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
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
                <TableCell>
                  {product.categories.map((c) => c.name).join(", ") || "—"}
                </TableCell>
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
                <TableCell className="flex justify-end gap-2">
                  <Link
                    href={`/admin/produkter/${product.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Redigera
                  </Link>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
