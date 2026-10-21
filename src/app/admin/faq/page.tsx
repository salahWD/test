import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import FaqEditor from "@/components/admin/FaqEditor";

export default async function AdminFaqPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        FAQ
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        Questions and answers shown on the Visit Us page (and in search
        results via structured data).
      </p>
      <div className="mt-8">
        <FaqEditor initial={c.faq} />
      </div>
    </div>
  );
}
