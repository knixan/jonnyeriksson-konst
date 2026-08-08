import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

const fallbackHeading = "Om konstnären";
const fallbackBody =
  "Min konst sträcker sig från lekfulla, färgstarka motiv skapade för de allra minsta till mer livfulla verk med en modern känsla. Jag hämtar inspiration från platser, föremål och ögonblick som väcker känslor eller lämnar ett bestående intryck hos mig.";

export async function AboutSection() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const about = settings?.about;

  return (
    <section id="om-konstnaren" className="bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 sm:items-center">
        {about?.image ? (
          <div className="relative aspect-4/5 overflow-hidden rounded-lg">
            <Image
              src={urlFor(about.image).width(900).height(1125).url()}
              alt={about.heading ?? fallbackHeading}
              fill
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div>
          <h2 className="text-4xl text-foreground">
            {about?.heading || fallbackHeading}
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-secondary-foreground">
            {about?.body?.length ? (
              <PortableText value={about.body} />
            ) : (
              <p>{fallbackBody}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
