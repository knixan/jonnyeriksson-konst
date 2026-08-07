"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateShippingSettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const flatRateKr = Number(formData.get("flatRateKr"));
  const freeShippingThresholdKr = formData.get("freeShippingThresholdKr");

  await prisma.shippingSettings.upsert({
    where: { id: 1 },
    update: {
      flatRateOre: Math.round(flatRateKr * 100),
      freeShippingThresholdOre: freeShippingThresholdKr
        ? Math.round(Number(freeShippingThresholdKr) * 100)
        : null,
    },
    create: {
      id: 1,
      flatRateOre: Math.round(flatRateKr * 100),
      freeShippingThresholdOre: freeShippingThresholdKr
        ? Math.round(Number(freeShippingThresholdKr) * 100)
        : null,
    },
  });

  revalidatePath("/admin/frakt");
}
