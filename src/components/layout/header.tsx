import Link from "next/link";

import { CartButton } from "@/components/cart/cart-button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl text-foreground">
          Jonny Eriksson
        </Link>
        <nav className="flex items-center gap-6 text-sm text-primary">
          <Link href="/produkter" className="hover:text-accent">
            Konstverk
          </Link>
          <Link href="/#om-konstnaren" className="hover:text-accent">
            Om konstnären
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
