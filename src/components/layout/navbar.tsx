"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartButton } from "@/components/cart/cart-button";
import { SearchForm } from "@/components/shop/search-form";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const searchRef = useRef<HTMLDivElement>(null);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!searchOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

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
          <div ref={searchRef} className="relative">
            <button
              type="button"
              aria-label={searchOpen ? "Stäng sök" : "Sök"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
              className="block text-muted-foreground hover:text-accent"
            >
              <Image
                src="/icon/icon-search.png"
                alt=""
                width={40}
                height={40}
                unoptimized
                className="size-8"
              />
            </button>
            {searchOpen ? (
              <SearchForm
                autoFocus
                onSubmit={() => setSearchOpen(false)}
                className="absolute top-full right-0 mt-3 w-64"
              />
            ) : null}
          </div>
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
        <nav className="flex flex-col gap-4 border-t border-border bg-background px-6 py-4 text-primary md:hidden">
          <SearchForm />
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
