import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import CateringEditor from "@/components/admin/CateringEditor";

export default async function AdminCateringPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Catering
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        Trays and platters on the catering page — names, prices, descriptions,
        and the lead-time note. Section ids stay fixed.
      </p>
      <div className="mt-8">
        <CateringEditor
          initialSections={c.catering}
          initialLeadTime={c.cateringLeadTime}
        />
      </div>
    </div>
  );
}
