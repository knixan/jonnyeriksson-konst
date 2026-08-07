"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProduct } from "@/app/admin/(protected)/produkter/actions";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={deleting}
      onClick={async () => {
        if (!confirm(`Ta bort "${productName}"? Detta går inte att ångra.`))
          return;
        setDeleting(true);
        try {
          await deleteProduct(productId);
          toast.success("Produkten togs bort");
          router.refresh();
        } catch {
          toast.error("Kunde inte ta bort produkten");
          setDeleting(false);
        }
      }}
    >
      {deleting ? "Tar bort…" : "Ta bort"}
    </Button>
  );
}
