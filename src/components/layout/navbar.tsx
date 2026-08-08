"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CartButton } from "@/components/cart/cart-button";

const navLinks = [
  { href: "/produkter?typ=ORIGINAL", label: "Original målningar" },
  { href: "/produkter?typ=PRINT", label: "Prints" },
  { href: "/#om-konstnaren", label: "Om konstnären" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-50 bg-transparent"
          : "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex flex-col items-start leading-none text-foreground"
        >
          <span className="font-script text-4xl sm:text-5xl">
            Jonny Eriksson
          </span>
          <span className="mt-1 self-center text-xs tracking-[0.35em] text-foreground uppercase">
            Konst
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-primary md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
          <Link
            href="/produkter"
            aria-label="Sök"
            className="text-muted-foreground hover:text-accent"
          >
            <Image
              src="/icon/icon-search.png"
              alt=""
              width={40}
              height={40}
              unoptimized
              className="size-8"
            />
          </Link>
          <CartButton />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <CartButton />
          <button
            type="button"
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex flex-col justify-center gap-1.5 p-1 text-foreground"
          >
            <span
              className={`h-px w-6 bg-current transition-transform ${
                open ? "translate-y-1.75 rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-current transition-transform ${
                open ? "-translate-y-1.75 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-6 py-4 text-primary md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 hover:text-accent">
              {link.label}
            </Link>
          ))}
          <Link href="/produkter" className="py-2 hover:text-accent">
            Sök
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
