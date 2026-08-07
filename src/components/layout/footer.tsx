import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";

import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export async function Footer() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const contact = settings?.contact;
  const footerText = settings?.footer?.text;

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-medium">Jonny Eriksson</p>
          {footerText ? (
            <p className="mt-2 max-w-sm text-sm text-footer-foreground/70">
              {footerText}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 text-sm text-footer-foreground/80">
          {contact?.phone ? (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 hover:text-accent"
            >
              <Phone className="size-4" />
              {contact.phone}
            </a>
          ) : null}
          {contact?.location ? (
            <span className="flex items-center gap-2">
              <MapPin className="size-4" />
              {contact.location}
            </span>
          ) : null}
          {contact?.instagramUrl ? (
            <Link
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent"
            >
              <FaInstagram className="size-4" />
              Instagram
            </Link>
          ) : null}
          {contact?.konstSeUrl ? (
            <Link
              href={contact.konstSeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              konst.se
            </Link>
          ) : null}
        </div>
      </div>
      <div className="border-t border-footer-foreground/10 px-6 py-4 text-center text-xs text-footer-foreground/50">
        © {new Date().getFullYear()} Jonny Eriksson
      </div>
    </footer>
  );
}
