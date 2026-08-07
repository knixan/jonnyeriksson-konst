"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sendContactMessage } from "@/app/(storefront)/kontakt/actions";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Ange namn"),
  email: z.email("Ange en giltig e-postadress"),
  message: z.string().min(1, "Skriv ett meddelande"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const result = await sendContactMessage(values);
    if ("error" in result) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }
    setSent(true);
    setSubmitting(false);
    reset();
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl text-foreground">Kontakt</h1>
      <p className="mt-3 text-muted-foreground">
        Har du en fråga om ett konstverk, en beställning eller vill du bara
        säga hej? Skriv gärna ett meddelande så hör jag av mig.
      </p>

      {sent ? (
        <p className="mt-8 rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          Tack för ditt meddelande! Jag återkommer så snart jag kan.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <FormField label="Namn" error={errors.name?.message}>
            <Input {...register("name")} />
          </FormField>
          <FormField label="E-post" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </FormField>
          <FormField label="Meddelande" error={errors.message?.message}>
            <Textarea rows={6} {...register("message")} />
          </FormField>
          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-fit"
            disabled={submitting}
          >
            {submitting ? "Skickar…" : "Skicka meddelande"}
          </Button>
        </form>
      )}
    </div>
  );
}
