import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import SiteEditor from "@/components/admin/SiteEditor";

export default async function AdminSitePage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Business info
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        Contact details, hours, and the online-ordering link.
      </p>
      <div className="mt-8">
        <SiteEditor
          initial={{
            cloverUrl: c.cloverUrl,
            phone: c.site.phone,
            phoneHref: c.site.phoneHref,
            email: c.site.email,
            hours: {
              opens: c.site.hours.opens,
              closes: c.site.hours.closes,
              display: c.site.hours.display,
              orderingWindow: c.site.hours.orderingWindow,
            },
            socials: c.site.socials,
          }}
        />
      </div>
    </div>
  );
}
