import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";

import { createCategory, deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl text-foreground">Kategorier</h1>

      <form action={createCategory} className="flex items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Ny kategori</Label>
          <Input id="name" name="name" required className="w-64" />
        </div>
        <Button type="submit" variant="cta">
          Lägg till
        </Button>
      </form>

      <div className="flex flex-col divide-y divide-border rounded-md border border-border">
        {categories.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Inga kategorier än.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 text-sm"
            >
              <span className="text-primary">
                {category.name}{" "}
                <span className="text-muted-foreground">
                  ({category._count.products} produkter)
                </span>
              </span>
              <form action={deleteCategory.bind(null, category.id)}>
                <Button type="submit" variant="ghost" size="sm">
                  Ta bort
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
