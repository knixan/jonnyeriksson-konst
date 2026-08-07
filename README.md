# Jonny Eriksson — Konst & Prints

Webbutik för konstnär Jonny Eriksson (Hallsberg). Kunder kan bläddra bland originalkonstverk och prints, lägga i varukorg och betala med kort (Stripe) eller Swish (manuell betalning). Sidans texter (hero, om konstnären, kontaktuppgifter) redigeras av kunden själv i Sanity Studio. Produkter, kategorier, ordrar och frakt hanteras i ett eget adminpanel.

## Teknikstack

| Del                                     | Teknik                                        |
| --------------------------------------- | --------------------------------------------- |
| Ramverk                                 | Next.js 16 (App Router)                       |
| UI                                      | React 19, Tailwind CSS 4, shadcn/ui (base-ui) |
| Innehåll (hero, om konstnären, kontakt) | Sanity CMS                                    |
| Produkter, kategorier, ordrar, frakt    | PostgreSQL + Prisma ORM                       |
| Admin-inloggning                        | better-auth (e-post/lösenord)                 |
| Betalning                               | Stripe Checkout + manuell Swish               |
| Bilduppladdning                         | UploadThing                                   |
| Formulär                                | React Hook Form + Zod                         |

## Kom igång

```bash
npm install
```

### 1. Miljövariabler

Fyll i det som saknas i `.env.local` (grundstruktur finns redan i filen):

| Variabel                                                                             | Används till                                                                                              |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`                       | Sanity-projekt (redan ifyllt)                                                                             |
| `SANITY_API_READ_TOKEN`                                                              | Läs-token för Live Content API — skapas i [manage.sanity.io](https://manage.sanity.io) under API → Tokens |
| `DATABASE_URL`                                                                       | Postgres-anslutning (i `.env`)                                                                            |
| `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`                                             | Admin-autentisering                                                                                       |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Kortbetalning i kassan — utan dessa visas ett meddelande om att välja Swish istället                      |
| `UPLOADTHING_TOKEN`                                                                  | Bilduppladdning i adminpanelen                                                                            |
| `NEXT_PUBLIC_SITE_URL`                                                               | Bas-URL för Stripe-redirects m.m.                                                                         |

### 2. Databas

```bash
npx prisma migrate dev   # skapar tabeller
npx prisma db seed       # exempeldata: kategorier, produkter, fraktinställning
npx tsx scripts/create-admin.ts   # skapar adminkonto (skriver ut e-post/lösenord i terminalen)
```

### 3. Sanity Studio

Starta appen (`npm run dev`) och öppna `/studio`. Skapa dokumentet **Webbplatsinställningar** (hero-rubrik, om konstnären, telefonnummer, Swish-nummer, Instagram, konst.se-länk, sidfotstext).

### 4. Starta

```bash
npm run dev
```

- Butik: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
- Adminpanel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Projektstruktur

```
src/app/(storefront)/    Butiken — startsida, produkter, kundvagn, kassa, orderbekräftelse
src/app/admin/            Adminpanel (inloggningsskyddad) — produkter, kategorier, ordrar, frakt
src/app/studio/           Sanity Studio (inbäddad)
src/app/api/              Stripe-webhook, UploadThing, better-auth
src/components/           UI-komponenter, indelade per område (shop, cart, admin, home, layout, ui)
src/sanity/               Sanity-schema, GROQ-frågor, klient
src/lib/                  Prisma-klient, Stripe, formattering, produktfrågor
prisma/schema.prisma      Datamodell för produkter, varianter, kategorier, ordrar, frakt
```

## Betalning

- **Kort**: Stripe Checkout (hosted). Webhook på `/api/stripe/webhook` markerar ordern som betald.
- **Swish**: Ingen Swish Handel-integration. Kunden ser ett Swish-nummer (från Sanity) och ordernumret att ange som meddelande, betalar manuellt, och admin markerar ordern som betald under Beställningar i adminpanelen.

## Scripts

```bash
npm run dev      # utvecklingsserver
npm run build    # produktionsbygge
npm run start    # kör produktionsbygge
npm run lint     # ESLint
npx tsc --noEmit # typkontroll
```
