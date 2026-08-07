"use client";

import Image from "next/image";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";

export type UploadedImage = { url: string; alt?: string };

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div
              key={image.url}
              className="relative size-24 overflow-hidden rounded-md border border-border"
            >
              <Image
                src={image.url}
                alt={image.alt ?? ""}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-cta text-xs text-cta-foreground"
                aria-label="Ta bort bild"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <UploadDropzone
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          onChange([...images, ...res.map((file) => ({ url: file.ufsUrl }))]);
          toast.success("Bild uppladdad");
        }}
        onUploadError={(error) => {
          toast.error(`Uppladdning misslyckades: ${error.message}`);
        }}
      />
    </div>
  );
}
