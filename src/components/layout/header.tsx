import Image from "next/image";
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
          <Link href="/produkter?typ=ORIGINAL" className="hover:text-accent">
            Original målningar
          </Link>
          <Link href="/produkter?typ=PRINT" className="hover:text-accent">
            Prints
          </Link>
          <Link href="/#om-konstnaren" className="hover:text-accent">
            Om konstnären
          </Link>
          <Link href="/kontakt" className="hover:text-accent">
            Kontakt
          </Link>
          <Link
            href="/produkter"
            aria-label="Sök"
            className="text-muted-foreground hover:text-accent"
          >
            <Image
              src="/icon/icon-search.png"
              alt=""
              width={20}
              height={20}
              unoptimized
              className="size-5"
            />
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
