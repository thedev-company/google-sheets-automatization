import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session) {
    redirect("/login");
  }

  async function logoutAction() {
    "use server";
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 border-r bg-background p-4 md:block">
        <div className="mb-6 text-lg font-semibold">Admin Panel</div>
        <nav className="space-y-2">
          <Link className="block rounded px-3 py-2 text-sm hover:bg-accent" href="/dashboard">
            Dashboard
          </Link>
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="text-sm text-muted-foreground">{session.user.email}</div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

