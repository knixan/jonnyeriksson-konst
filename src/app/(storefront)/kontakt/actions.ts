"use server";

import { z } from "zod";

import { mailer } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  message: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;

type ActionResult = { error: string } | { success: true };

export async function sendContactMessage(
  input: ContactInput,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Fyll i namn, e-post och ett meddelande." };
  }
  const { name, email, message } = parsed.data;

  if (!mailer) {
    return {
      error:
        "Kontaktformuläret är inte konfigurerat ännu. Ring eller maila istället.",
    };
  }

  const to = process.env.CONTACT_EMAIL_TO || "jonnyeriksson@hotmail.com";

  try {
    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to,
      replyTo: email,
      subject: `Nytt meddelande från ${name} (jonnyeriksson.art)`,
      text: `Namn: ${name}\nE-post: ${email}\n\n${message}`,
    });
  } catch {
    return { error: "Kunde inte skicka meddelandet. Försök igen senare." };
  }

  return { success: true };
}
