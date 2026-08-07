"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
  await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.category.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/admin/kategorier");
  revalidatePath("/produkter");
}

export async function deleteCategory(categoryId: string) {
  await requireSession();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/kategorier");
  revalidatePath("/produkter");
}
