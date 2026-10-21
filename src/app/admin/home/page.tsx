import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import HomeEditor from "@/components/admin/HomeEditor";

export default async function AdminHomePage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Home page
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        The words on the home page — the big opening lines, the mouneh corner,
        and the order call-out at the bottom.
      </p>
      <div className="mt-8">
        <HomeEditor initial={c.home} />
      </div>
    </div>
  );
}
