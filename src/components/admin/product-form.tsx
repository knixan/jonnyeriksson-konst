"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
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
  categoryIds: string[];
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
  const form = useForm<ProductFormValues>({ defaultValues });
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });
  const images = useWatch({ control, name: "images" });
  const categoryIds = useWatch({ control, name: "categoryIds" });
  const type = useWatch({ control, name: "type" });

  const typeRegister = register("type");

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
    <FormProvider {...form}>
      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-name">Namn</Label>
            <Input
              id="product-name"
              {...register("name", { required: true })}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">Ange ett namn</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-slug">Slug (URL)</Label>
            <Input
              id="product-slug"
              {...register("slug", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-type">Typ</Label>
            <select
              id="product-type"
              {...typeRegister}
              onChange={(event) => {
                typeRegister.onChange(event);
                if (event.target.value === "ORIGINAL") {
                  const current = getValues("variants");
                  replace([
                    {
                      size: "Original",
                      framed: false,
                      priceKr: current[0]?.priceKr ?? 0,
                      inStock: current[0]?.inStock ?? true,
                    },
                  ]);
                }
              }}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="PRINT">Print</option>
              <option value="ORIGINAL">Original (1 exemplar)</option>
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
            <Label>Kategorier</Label>
            <div className="flex flex-wrap gap-3 rounded-lg border border-input px-3 py-2">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Inga kategorier skapade än.
                </p>
              ) : (
                categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-1.5 text-sm text-primary"
                  >
                    <Checkbox
                      checked={categoryIds.includes(category.id)}
                      onCheckedChange={(checked) =>
                        setValue(
                          "categoryIds",
                          checked
                            ? [...categoryIds, category.id]
                            : categoryIds.filter((id) => id !== category.id),
                        )
                      }
                    />
                    {category.name}
                  </label>
                ))
              )}
            </div>
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

        {type === "ORIGINAL" ? (
          <OriginalPriceField control={control} />
        ) : (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <Label>Storlekar och priser</Label>
              <Button
                type="button"
                variant="cta"
                size="sm"
                onClick={() =>
                  append({
                    size: "",
                    framed: false,
                    priceKr: 0,
                    inStock: true,
                  })
                }
              >
                + Lägg till storlek
              </Button>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              Varje rad är en storlek/utförande med eget pris i kronor. Klicka
              &quot;+ Lägg till storlek&quot; för att lägga till fler.
            </p>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <VariantRow
                  key={field.id}
                  control={control}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Inga storlekar tillagda än — klicka på knappen ovan för att
                  lägga till en storlek och ett pris.
                </p>
              ) : null}
            </div>
          </div>
        )}

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
    </FormProvider>
  );
}

function OriginalPriceField({
  control,
}: {
  control: Control<ProductFormValues>;
}) {
  const { register, setValue } = useFormContext<ProductFormValues>();
  const inStock = useWatch({ control, name: "variants.0.inStock" });

  return (
    <div>
      <Label>Pris</Label>
      <p className="mb-2 text-xs text-muted-foreground">
        Originalmålningar finns bara i ett exemplar och har inga
        storleksvarianter.
      </p>
      <div className="flex items-center gap-4 rounded-md border border-border p-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="original-price" className="text-xs">
            Pris (kr)
          </Label>
          <Input
            id="original-price"
            type="number"
            step="1"
            className="w-32"
            {...register("variants.0.priceKr", {
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>
        <label className="mt-5 flex items-center gap-1.5 text-sm text-primary">
          <Checkbox
            checked={inStock}
            onCheckedChange={(checked) =>
              setValue("variants.0.inStock", checked === true)
            }
          />
          Finns kvar
        </label>
      </div>
    </div>
  );
}

function VariantRow({
  control,
  index,
  onRemove,
}: {
  control: Control<ProductFormValues>;
  index: number;
  onRemove: () => void;
}) {
  const { register, setValue } = useFormContext<ProductFormValues>();
  const framed = useWatch({ control, name: `variants.${index}.framed` });
  const inStock = useWatch({ control, name: `variants.${index}.inStock` });

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 rounded-md border border-border p-3">
      <Input
        placeholder="Storlek, t.ex. A4 eller Original"
        {...register(`variants.${index}.size` as const, {
          required: true,
        })}
      />
      <label className="flex items-center gap-1.5 text-sm text-primary">
        <Checkbox
          checked={framed}
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
          checked={inStock}
          onCheckedChange={(checked) =>
            setValue(`variants.${index}.inStock`, checked === true)
          }
        />
        I lager
      </label>
      <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
        Ta bort
      </Button>
    </div>
  );
}
