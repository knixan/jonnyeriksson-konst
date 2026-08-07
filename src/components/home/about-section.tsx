import { PortableText } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";

export async function AboutSection() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const about = settings?.about;

  if (!about?.heading && !about?.body?.length) {
    return null;
  }

  return (
    <section id="om-konstnaren" className="bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 sm:items-center">
        {about.image ? (
          <div className="relative aspect-4/5 overflow-hidden rounded-lg">
            <Image
              src={urlFor(about.image).width(900).height(1125).url()}
              alt={about.heading ?? "Jonny Eriksson"}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <div>
          {about.heading ? (
            <h2 className="text-4xl text-foreground">{about.heading}</h2>
          ) : null}
          {about.body ? (
            <div className="mt-4 flex flex-col gap-4 text-secondary-foreground">
              <PortableText value={about.body} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
