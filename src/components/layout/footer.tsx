import Image from "next/image";
import Link from "next/link";

import { SITE_SETTINGS_QUERY, type SiteSettings } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

const fallbackContact = {
  email: "jonnyeriksson@hotmail.com",
  location: "Hallsberg, Sverige",
  instagramUrl: "https://www.instagram.com/jonnyeriksson.art/",
};

export async function Footer() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;
  const contact = settings?.contact;
  const footerText = settings?.footer?.text;

  const email = contact?.email || fallbackContact.email;
  const location = contact?.location || fallbackContact.location;
  const instagramUrl = contact?.instagramUrl || fallbackContact.instagramUrl;

  return (
    <footer id="kontakt" className="bg-footer text-footer-foreground">
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
              <Image
                src="/icon/icon-phone.png"
                alt=""
                width={16}
                height={16}
                unoptimized
                className="size-4"
              />
              {contact.phone}
            </a>
          ) : null}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-accent"
          >
            <Image
              src="/icon/icon-email.png"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="size-4"
            />
            {email}
          </a>
          <span className="flex items-center gap-2">
            <Image
              src="/icon/icon-map-nail.png"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="size-4"
            />
            {location}
          </span>
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-accent"
          >
            <Image
              src="/icon/icon-insta.png"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="size-4"
            />
            Instagram
          </Link>
          {contact?.facebookUrl ? (
            <Link
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent"
            >
              <Image
                src="/icon/icon-facebook.png"
                alt=""
                width={16}
                height={16}
                unoptimized
                className="size-4"
              />
              Facebook
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
        © {new Date().getFullYear()} Jonny Eriksson - Kod och Design av Josefine Eriksson
      </div>
    </footer>
  );
}
