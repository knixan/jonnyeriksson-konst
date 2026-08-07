import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

export async function Hero() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const hero = settings?.hero;
  const imageUrl = hero?.image
    ? urlFor(hero.image).width(1600).height(1000).url()
    : "/hero.png";

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-background">
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-background/40" />
      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <h1 className="max-w-2xl text-5xl text-foreground sm:text-6xl">
          {hero?.heading || "Jonny Eriksson"}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          {hero?.subheading || "Originalkonstverk och prints från Hallsberg."}
        </p>
        <Button
          render={<Link href="/produkter" />}
          nativeButton={false}
          variant="cta"
          size="lg"
        >
          Se konstverk
        </Button>
      </div>
    </section>
  );
}
