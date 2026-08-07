import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/admin/sidebar-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr] bg-background">
      <aside className="flex flex-col gap-6 border-r border-border p-4">
        <p className="px-3 text-lg text-foreground">Admin</p>
        <SidebarNav />
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
          <SignOutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
