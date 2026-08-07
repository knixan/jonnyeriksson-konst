"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ProductFormValues } from "@/components/admin/product-form";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function createProduct(values: ProductFormValues) {
  await requireSession();

  if (!values.name || !values.slug) {
    return { error: "Namn och slug krävs." };
  }

  try {
    await prisma.product.create({
      data: {
        name: values.name,
        slug: values.slug,
        description: values.description,
        type: values.type,
        status: values.status,
        categoryId: values.categoryId || null,
        images: {
          create: values.images.map((image, position) => ({
            url: image.url,
            alt: image.alt,
            position,
          })),
        },
        variants: {
          create: values.variants.map((variant, sortOrder) => ({
            size: variant.size,
            framed: variant.framed,
            priceOre: Math.round(variant.priceKr * 100),
            inStock: variant.inStock,
            sortOrder,
          })),
        },
      },
    });
  } catch {
    return {
      error: "Kunde inte skapa produkten. Kontrollera att slugen är unik.",
    };
  }

  revalidatePath("/admin/produkter");
  revalidatePath("/produkter");
}

export async function updateProduct(
  productId: string,
  values: ProductFormValues,
) {
  await requireSession();

  if (!values.name || !values.slug) {
    return { error: "Namn och slug krävs." };
  }

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          name: values.name,
          slug: values.slug,
          description: values.description,
          type: values.type,
          status: values.status,
          categoryId: values.categoryId || null,
        },
      }),
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.productImage.createMany({
        data: values.images.map((image, position) => ({
          productId,
          url: image.url,
          alt: image.alt,
          position,
        })),
      }),
      prisma.productVariant.deleteMany({ where: { productId } }),
      prisma.productVariant.createMany({
        data: values.variants.map((variant, sortOrder) => ({
          productId,
          size: variant.size,
          framed: variant.framed,
          priceOre: Math.round(variant.priceKr * 100),
          inStock: variant.inStock,
          sortOrder,
        })),
      }),
    ]);
  } catch {
    return {
      error: "Kunde inte spara produkten. Kontrollera att slugen är unik.",
    };
  }

  revalidatePath("/admin/produkter");
  revalidatePath("/produkter");
  revalidatePath(`/produkter/${values.slug}`);
}

export async function setProductStatus(
  productId: string,
  status: "DRAFT" | "ACTIVE",
) {
  await requireSession();
  await prisma.product.update({ where: { id: productId }, data: { status } });
  revalidatePath("/admin/produkter");
  revalidatePath("/produkter");
}
