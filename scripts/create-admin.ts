import "./load-env";

import { randomBytes, randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";

import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@jonnyeriksson.art";
  const generatedPassword = randomBytes(9).toString("base64url");
  const password = process.env.ADMIN_PASSWORD ?? generatedPassword;
  const name = process.env.ADMIN_NAME ?? "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error(`En användare med e-post ${email} finns redan.`);
  }

  // Skapar kontot direkt via Prisma (samma User/Account-form som better-auths
  // sign-up-endpoint) istället för att anropa auth.api.signUpEmail, eftersom
  // emailAndPassword.disableSignUp: true i src/lib/auth.ts blockerar den
  // endpointen helt — med rätta, det är den enda spärren mot att någon utifrån
  // skapar ett konto som kommer förbi /admin-inloggningen.
  const passwordHash = await hashPassword(password);
  const userId = randomUUID();
  const now = new Date();

  await prisma.$transaction([
    prisma.user.create({
      data: { id: userId, email, name, emailVerified: false, createdAt: now, updatedAt: now },
    }),
    prisma.account.create({
      data: {
        id: randomUUID(),
        userId,
        accountId: userId,
        providerId: "credential",
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      },
    }),
  ]);

  console.log("Adminkonto skapat:");
  console.log(`  E-post:  ${email}`);
  console.log(`  Lösenord: ${password}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      "\n(Slumpat lösenord — byt det i adminpanelen efter första inloggningen.)",
    );
  }
}

main()
  .catch((error) => {
    console.error("Kunde inte skapa adminkonto:", error?.message ?? error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
