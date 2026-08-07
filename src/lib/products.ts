import { prisma } from "@/lib/prisma";

const productInclude = {
  category: true,
  images: { orderBy: { position: "asc" as const } },
  variants: { orderBy: { sortOrder: "asc" as const } },
};

export function getActiveProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      category: categorySlug ? { slug: categorySlug } : undefined,
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getLatestProducts(take: number) {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: productInclude,
  });
}

export function getCategories() {
  return prisma.category.findMany({
    where: { products: { some: { status: "ACTIVE" } } },
    orderBy: { name: "asc" },
  });
}
