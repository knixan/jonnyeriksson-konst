const currencyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

export function formatPrice(ore: number) {
  return currencyFormatter.format(ore / 100);
}

export function variantLabel(size: string, framed: boolean) {
  return framed ? `${size}, inramad` : size;
}
