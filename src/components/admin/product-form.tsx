"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  ImageUploader,
  type UploadedImage,
} from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  type: "ORIGINAL" | "PRINT";
  status: "DRAFT" | "ACTIVE";
  categoryId: string;
  images: UploadedImage[];
  variants: {
    id?: string;
    size: string;
    framed: boolean;
    priceKr: number;
    inStock: boolean;
  }[];
};

export function ProductForm({
  defaultValues,
  categories,
  onSubmit,
  submitLabel,
}: {
  defaultValues: ProductFormValues;
  categories: { id: string; name: string }[];
  onSubmit: (values: ProductFormValues) => Promise<{ error: string } | void>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const images = watch("images");

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);
    const result = await onSubmit(values);
    if (result?.error) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }
    toast.success("Produkt sparad");
    router.push("/admin/produkter");
    router.refresh();
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-name">Namn</Label>
          <Input id="product-name" {...register("name", { required: true })} />
          {errors.name ? (
            <p className="text-xs text-destructive">Ange ett namn</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-slug">Slug (URL)</Label>
          <Input id="product-slug" {...register("slug", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-type">Typ</Label>
          <select
            id="product-type"
            {...register("type")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="PRINT">Print</option>
            <option value="ORIGINAL">Original</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-status">Status</Label>
          <select
            id="product-status"
            {...register("status")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="DRAFT">Utkast (dold i butiken)</option>
            <option value="ACTIVE">Publicerad</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="product-category">Kategori</Label>
          <select
            id="product-category"
            {...register("categoryId")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="">Ingen kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="product-description">Beskrivning</Label>
          <Textarea
            id="product-description"
            rows={4}
            {...register("description")}
          />
        </div>
      </div>

      <div>
        <Label>Bilder</Label>
        <div className="mt-2">
          <ImageUploader
            images={images}
            onChange={(next) => setValue("images", next)}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Varianter</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ size: "", framed: false, priceKr: 0, inStock: true })
            }
          >
            Lägg till variant
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 rounded-md border border-border p-3"
            >
              <Input
                placeholder="Storlek, t.ex. A4 eller Original"
                {...register(`variants.${index}.size` as const, {
                  required: true,
                })}
              />
              <label className="flex items-center gap-1.5 text-sm text-primary">
                <Checkbox
                  checked={watch(`variants.${index}.framed`)}
                  onCheckedChange={(checked) =>
                    setValue(`variants.${index}.framed`, checked === true)
                  }
                />
                Inramad
              </label>
              <Input
                type="number"
                step="1"
                className="w-24"
                placeholder="Pris (kr)"
                {...register(`variants.${index}.priceKr` as const, {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <label className="flex items-center gap-1.5 text-sm text-primary">
                <Checkbox
                  checked={watch(`variants.${index}.inStock`)}
                  onCheckedChange={(checked) =>
                    setValue(`variants.${index}.inStock`, checked === true)
                  }
                />
                I lager
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                Ta bort
              </Button>
            </div>
          ))}
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Inga varianter tillagda än.
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        variant="cta"
        size="lg"
        disabled={submitting}
        className="w-fit"
      >
        {submitting ? "Sparar…" : submitLabel}
      </Button>
    </form>
  );
}
