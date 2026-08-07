"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
}

export async function markOrderPaid(orderId: string) {
  await requireSession();
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID" },
  });
  revalidatePath(`/admin/bestallningar/${orderId}`);
  revalidatePath("/admin/bestallningar");
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireSession();
  const status = String(formData.get("status"));
  if (status !== "NEW" && status !== "PROCESSING" && status !== "SHIPPED")
    return;

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath(`/admin/bestallningar/${orderId}`);
  revalidatePath("/admin/bestallningar");
}
