"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";

export type UploadedImage = { url: string; alt?: string };

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [urlInput, setUrlInput] = useState("");

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("Ogiltig bildlänk.");
      return;
    }
    onChange([...images, { url }]);
    setUrlInput("");
  };

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

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        eller klistra in en bildlänk
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://…"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addUrl}>
          Lägg till länk
        </Button>
      </div>
    </div>
  );
}
