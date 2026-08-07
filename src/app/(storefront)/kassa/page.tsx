"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createOrder } from "@/app/(storefront)/kassa/actions";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
  name: z.string().min(1, "Ange namn"),
  email: z.string().email("Ange en giltig e-postadress"),
  phone: z.string().min(1, "Ange telefonnummer"),
  addressLine1: z.string().min(1, "Ange adress"),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(1, "Ange postnummer"),
  city: z.string().min(1, "Ange ort"),
  paymentMethod: z.enum(["STRIPE", "SWISH"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { items, subtotalOre } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { paymentMethod: "STRIPE" },
  });

  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-4xl text-foreground">Din varukorg är tom</h1>
        <Button
          variant="cta"
          nativeButton={false}
          render={<Link href="/produkter" />}
        >
          Se konstverk
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const result = await createOrder({
        ...values,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });
      if (result?.error) {
        toast.error(result.error);
        setSubmitting(false);
      }
    } catch (error) {
      if ((error as Error)?.message?.includes("NEXT_REDIRECT")) throw error;
      toast.error("Något gick fel. Försök igen.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-[1.2fr_1fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <h1 className="text-4xl text-foreground">Kassa</h1>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Namn" error={errors.name?.message}>
            <Input {...register("name")} />
          </Field>
          <Field label="E-post" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Field label="Telefon" error={errors.phone?.message}>
            <Input {...register("phone")} />
          </Field>
          <Field label="Postnummer" error={errors.postalCode?.message}>
            <Input {...register("postalCode")} />
          </Field>
          <Field
            label="Adress"
            error={errors.addressLine1?.message}
            className="sm:col-span-2"
          >
            <Input {...register("addressLine1")} />
          </Field>
          <Field label="Adress, rad 2 (valfritt)" className="sm:col-span-2">
            <Input {...register("addressLine2")} />
          </Field>
          <Field label="Ort" error={errors.city?.message}>
            <Input {...register("city")} />
          </Field>
        </div>

        <fieldset className="mt-4 flex flex-col gap-2">
          <legend className="mb-1 text-sm text-primary">Betalning</legend>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
              paymentMethod === "STRIPE" ? "border-cta" : "border-border"
            }`}
          >
            <input
              type="radio"
              value="STRIPE"
              checked={paymentMethod === "STRIPE"}
              onChange={() => setValue("paymentMethod", "STRIPE")}
            />
            Kort (Stripe)
          </label>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
              paymentMethod === "SWISH" ? "border-cta" : "border-border"
            }`}
          >
            <input
              type="radio"
              value="SWISH"
              checked={paymentMethod === "SWISH"}
              onChange={() => setValue("paymentMethod", "SWISH")}
            />
            Swish (manuell betalning)
          </label>
          {paymentMethod === "SWISH" ? (
            <p className="rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
              Efter beställning visas ett Swish-nummer och ett ordernummer att
              ange som meddelande. Betalningen hanteras manuellt och bekräftas
              av oss.
            </p>
          ) : null}
        </fieldset>

        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="mt-4"
          disabled={submitting}
        >
          {submitting ? "Skickar order…" : "Genomför köp"}
        </Button>
      </form>

      <aside className="flex h-fit flex-col gap-3 rounded-md border border-border p-6">
        <h2 className="text-lg text-foreground">Din order</h2>
        {items.map((item) => (
          <div key={item.variantId} className="flex justify-between text-sm">
            <span className="text-primary">
              {item.productName} ({item.variantLabel}) × {item.quantity}
            </span>
            <span className="text-foreground">
              {formatPrice(item.priceOre * item.quantity)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-border pt-3 text-sm text-muted-foreground">
          <span>Delsumma</span>
          <span>{formatPrice(subtotalOre)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Frakt läggs till av oss innan betalning.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm text-primary ${className ?? ""}`}
    >
      {label}
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
