import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const malningar = await prisma.category.upsert({
    where: { slug: "malningar" },
    update: {},
    create: { name: "Målningar", slug: "malningar" },
  });

  const grafik = await prisma.category.upsert({
    where: { slug: "grafik" },
    update: {},
    create: { name: "Grafik", slug: "grafik" },
  });

  const original = await prisma.category.upsert({
    where: { slug: "original" },
    update: {},
    create: { name: "Original", slug: "original" },
  });

  await prisma.product.upsert({
    where: { slug: "vinterlandskap" },
    update: {},
    create: {
      slug: "vinterlandskap",
      name: "Vinterlandskap",
      description:
        "Ett stämningsfullt vinterlandskap i varma jordtoner, målat i olja på duk.",
      type: "ORIGINAL",
      status: "ACTIVE",
      categories: { connect: { id: original.id } },
      variants: {
        create: [
          { size: "Original, 60x80 cm", framed: false, priceOre: 850000 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "sommaraeng" },
    update: {},
    create: {
      slug: "sommaraeng",
      name: "Sommaräng",
      description: "Print av ett ljust sommarmotiv i akvarell.",
      type: "PRINT",
      status: "ACTIVE",
      categories: { connect: { id: malningar.id } },
      variants: {
        create: [
          { size: "A4", framed: false, priceOre: 39900, sortOrder: 0 },
          { size: "A4", framed: true, priceOre: 69900, sortOrder: 1 },
          { size: "A3", framed: false, priceOre: 59900, sortOrder: 2 },
          { size: "A3", framed: true, priceOre: 94900, sortOrder: 3 },
          { size: "50x70 cm", framed: false, priceOre: 89900, sortOrder: 4 },
          { size: "50x70 cm", framed: true, priceOre: 149900, sortOrder: 5 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "skogsstig" },
    update: {},
    create: {
      slug: "skogsstig",
      name: "Skogsstig",
      description:
        "Grafiskt tryck i begränsad upplaga, inspirerat av Närkes skogar.",
      type: "PRINT",
      status: "ACTIVE",
      categories: { connect: { id: grafik.id } },
      variants: {
        create: [
          { size: "A4", framed: false, priceOre: 44900, sortOrder: 0 },
          { size: "A3", framed: false, priceOre: 64900, sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.shippingSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, flatRateOre: 5900, freeShippingThresholdOre: 100000 },
  });

  console.log("Seed klar.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
