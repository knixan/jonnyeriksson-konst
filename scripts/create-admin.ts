import "./load-env";

import { randomBytes } from "node:crypto";

import { auth } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@jonnyeriksson.art";
  const generatedPassword = randomBytes(9).toString("base64url");
  const password = process.env.ADMIN_PASSWORD ?? generatedPassword;
  const name = process.env.ADMIN_NAME ?? "Admin";

  await auth.api.signUpEmail({ body: { email, password, name } });

  console.log("Adminkonto skapat:");
  console.log(`  E-post:  ${email}`);
  console.log(`  Lösenord: ${password}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      "\n(Slumpat lösenord — byt det i adminpanelen efter första inloggningen.)",
    );
  }
}

main().catch((error) => {
  console.error("Kunde inte skapa adminkonto:", error?.message ?? error);
  process.exitCode = 1;
});
