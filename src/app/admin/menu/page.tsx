import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import MenuEditor from "@/components/admin/MenuEditor";

export default async function AdminMenuPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Menu
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        Edit items, prices, and descriptions. &ldquo;House favorite&rdquo;
        items are showcased across the site.
      </p>
      <div className="mt-8">
        <MenuEditor initialCategories={c.categories} initialMenu={c.menu} />
      </div>
    </div>
  );
}
