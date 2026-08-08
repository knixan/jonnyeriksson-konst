"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function SearchForm({
  initialValue = "",
  redirectParams,
  className,
  autoFocus,
  onSubmit,
}: {
  initialValue?: string;
  redirectParams?: Record<string, string | undefined>;
  className?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(redirectParams ?? {})) {
      if (value) params.set(key, value);
    }
    const trimmed = query.trim();
    if (trimmed) {
      params.set("sok", trimmed);
    }
    const queryString = params.toString();
    router.push(`/produkter${queryString ? `?${queryString}` : ""}`);
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
        <Image
          src="/icon/icon-search.png"
          alt=""
          width={16}
          height={16}
          unoptimized
          className="size-4 shrink-0"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sök konstverk..."
          aria-label="Sök konstverk"
          autoFocus={autoFocus}
          className="h-auto border-0 bg-transparent p-0 focus-visible:ring-0"
        />
      </div>
    </form>
  );
}
