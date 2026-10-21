import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent } from "@/lib/cms/store";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";

export default async function AdminTestimonialsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const c = await loadContent();
  return (
    <div>
      <h1 className="font-display text-[2.2rem] font-medium text-charcoal">
        Reviews
      </h1>
      <p className="mt-2 text-[15px] text-charcoal-60">
        The customer quotes that rotate on the homepage.
      </p>
      <div className="mt-8">
        <TestimonialsEditor initial={c.testimonials} />
      </div>
    </div>
  );
}
