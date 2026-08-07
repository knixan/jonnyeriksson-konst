import type { SanityImageSource } from "@sanity/image-url";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_id == "siteSettings"][0]{ hero, about, contact, footer, announcement }`,
);

export type SiteSettings = {
  hero?: {
    heading?: string;
    subheading?: string;
    image?: SanityImageSource;
  };
  about?: {
    heading?: string;
    body?: PortableTextBlock[];
    image?: SanityImageSource;
  };
  contact?: {
    phone?: string;
    swishPhone?: string;
    instagramUrl?: string;
    konstSeUrl?: string;
    location?: string;
  };
  footer?: {
    text?: string;
  };
  announcement?: {
    enabled?: boolean;
    text?: string;
  };
};
