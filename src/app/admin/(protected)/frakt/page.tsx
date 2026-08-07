import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";

import { updateShippingSettings } from "./actions";

export default async function AdminShippingPage() {
  const settings = await prisma.shippingSettings.findUnique({
    where: { id: 1 },
  });

  return (
    <div className="flex max-w-md flex-col gap-6">
      <h1 className="text-3xl text-foreground">Frakt</h1>
      <form action={updateShippingSettings} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="flatRateKr">Fast fraktpris (kr)</Label>
          <Input
            id="flatRateKr"
            name="flatRateKr"
            type="number"
            step="1"
            defaultValue={settings ? settings.flatRateOre / 100 : 0}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="freeShippingThresholdKr">
            Fri frakt över (kr, valfritt)
          </Label>
          <Input
            id="freeShippingThresholdKr"
            name="freeShippingThresholdKr"
            type="number"
            step="1"
            defaultValue={
              settings?.freeShippingThresholdOre
                ? settings.freeShippingThresholdOre / 100
                : ""
            }
          />
        </div>
        <Button type="submit" variant="cta" className="w-fit">
          Spara
        </Button>
      </form>
    </div>
  );
}
