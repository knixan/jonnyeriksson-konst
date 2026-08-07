import Link from "next/link";

import { AboutSection } from "@/components/home/about-section";
import { FeatureStrip } from "@/components/home/feature-strip";
import { Hero } from "@/components/home/hero";
import { ProductGrid } from "@/components/shop/product-grid";
import { getLatestProducts } from "@/lib/products";

export default async function Home() {
  const products = await getLatestProducts(8);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-4xl text-foreground">Senaste konstverk</h2>
            <Link
              href="/produkter"
              className="text-sm text-primary hover:text-accent"
            >
              Visa alla →
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
      <AboutSection />
    </>
  );
}
