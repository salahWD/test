import { redirect } from "next/navigation";
import { cmsEnabled, isAdmin } from "@/lib/cms/auth";
import { login } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  if (!cmsEnabled()) {
    return (
      <div className="mx-auto max-w-[480px] border border-tahini bg-garlic p-8">
        <h1 className="font-display text-[1.8rem] font-medium text-charcoal">
          Admin is not configured
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-charcoal-60">
          Set an <code className="font-semibold">ADMIN_PASSWORD</code>{" "}
          environment variable and restart the server to enable the content
          editor.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[420px]">
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Sign in
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        Enter the admin password to edit the site&rsquo;s content.
      </p>
      <form action={login} className="mt-8 space-y-5">
        <div>
          <label htmlFor="password" className="eyebrow text-charcoal-60">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full border border-tahini bg-garlic px-4 py-3 text-charcoal outline-none transition-colors duration-250 focus:border-olive"
          />
        </div>
        {error && (
          <p role="alert" className="text-[14px] font-medium text-gold-ink">
            That password didn&rsquo;t match — try again.
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-forest px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors duration-250 hover:bg-forest-deep"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
