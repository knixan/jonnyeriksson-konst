import Image from "next/image";

import { isOptimizableImageUrl } from "@/lib/images";

export function ProductGallery({
  images,
  alt,
}: {
  images: { url: string; alt: string | null }[];
  alt: string;
}) {
  if (!images.length) {
    return (
      <div className="flex aspect-4/5 items-center justify-center rounded-lg bg-card text-sm text-muted-foreground">
        Ingen bild ännu
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="relative aspect-4/5 overflow-hidden rounded-lg bg-card"
        >
          <Image
            src={image.url}
            alt={image.alt ?? alt}
            fill
            priority={index === 0}
            unoptimized={!isOptimizableImageUrl(image.url)}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
