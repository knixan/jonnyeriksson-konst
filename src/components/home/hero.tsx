import Image from "next/image";
import Link from "next/link";

import { BrushStroke, buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

export async function Hero() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const hero = settings?.hero;
  const imageUrl = hero?.image
    ? urlFor(hero.image).width(1920).height(1200).url()
    : "/hero.png";

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/75 to-background/10" />
      </div>
      <div className="relative mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-6 py-24">
        <p className="text-xs tracking-[0.2em] text-accent uppercase">
          {hero?.eyebrow || "Platser · Föremål · Fantasi"}
        </p>
        <h1 className="mt-4 max-w-xl text-5xl text-foreground sm:text-6xl">
          {hero?.heading || "Känslan framför det exakta"}
        </h1>
        <p className="mt-6 max-w-md text-muted-foreground">
          {hero?.subheading ||
            "Jag inspireras av platser, föremål och fantasi. När jag målar försöker jag fånga känslan och stämningen i mitt motiv, snarare än att återge det exakt som det ser ut."}
        </p>
        <Link
          href="/produkter"
          className={buttonVariants({
            variant: "brush",
            className:
              "mt-8 h-auto w-fit gap-2 px-9 py-5 text-sm uppercase tracking-wide",
          })}
        >
          <BrushStroke />
          <span>Upptäck konstverken</span>
          <span aria-hidden className="text-xl font-light">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
