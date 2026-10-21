import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isAdmin } from "@/lib/cms/auth";
import { logout } from "./actions";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The admin panel is auth-gated per request and must NEVER be prerendered.
// Without this, a build run WITHOUT ADMIN_PASSWORD (CI never has secrets)
// takes isAdmin()'s cmsEnabled() early-return before cookies() is reached,
// so Next statically prerenders every admin page as a login redirect; on the
// server — where the password IS set — the first revalidatePath("/","layout")
// invalidates those static entries and their regeneration hits cookies() in
// a static context: DYNAMIC_SERVER_USAGE, and /admin 500s permanently.
export const dynamic = "force-dynamic";

/** Owner-only CMS chrome — deliberately plain, no marketing motion. */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-tahini bg-garlic/60">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/brand/logo.png"
                alt=""
                width={46}
                height={37}
                className="h-9 w-auto"
              />
              <span className="eyebrow text-charcoal">Admin</span>
            </Link>
            {authed && <AdminNav />}
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-[13px] font-semibold uppercase tracking-[0.08em] text-charcoal-60 transition-colors duration-250 hover:text-forest"
            >
              View site ↗
            </Link>
            {authed && (
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full bg-forest px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-cream transition-colors duration-250 hover:bg-forest-deep"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-5 py-10">{children}</main>
    </div>
  );
}
