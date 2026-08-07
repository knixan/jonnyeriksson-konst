import Link from "next/link";

const links = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/kategorier", label: "Kategorier" },
  { href: "/admin/bestallningar", label: "Beställningar" },
  { href: "/admin/frakt", label: "Frakt" },
];

export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm text-primary hover:bg-secondary hover:text-accent"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
