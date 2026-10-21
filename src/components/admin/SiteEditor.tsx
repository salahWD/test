"use client";

import { useState } from "react";
import { saveSite } from "@/app/admin/actions";
import type { SiteEditable } from "@/lib/cms/schema";
import { Field, TextInput, SaveBar } from "./ui";

export default function SiteEditor({ initial }: { initial: SiteEditable }) {
  const [data, setData] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const set = <K extends keyof SiteEditable>(key: K, value: SiteEditable[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  return (
    <div className="max-w-[720px]">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone (display)">
          <TextInput
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Phone (tel: link)" hint="Format: tel:+17603608178">
          <TextInput
            value={data.phoneHref}
            onChange={(e) => set("phoneHref", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Clover ordering link">
          <TextInput
            value={data.cloverUrl}
            onChange={(e) => set("cloverUrl", e.target.value)}
          />
        </Field>
      </div>

      <h2 className="mt-10 font-display text-[1.5rem] font-medium text-charcoal">
        Hours
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Field label="Opens" hint="24-hour HH:MM — drives the live open/closed chip">
          <TextInput
            value={data.hours.opens}
            onChange={(e) => set("hours", { ...data.hours, opens: e.target.value })}
          />
        </Field>
        <Field label="Closes" hint="24-hour HH:MM">
          <TextInput
            value={data.hours.closes}
            onChange={(e) => set("hours", { ...data.hours, closes: e.target.value })}
          />
        </Field>
        <Field label="Hours line (shown on the site)">
          <TextInput
            value={data.hours.display}
            onChange={(e) => set("hours", { ...data.hours, display: e.target.value })}
          />
        </Field>
        <Field label="Online-ordering note">
          <TextInput
            value={data.hours.orderingWindow}
            onChange={(e) =>
              set("hours", { ...data.hours, orderingWindow: e.target.value })
            }
          />
        </Field>
      </div>

      <h2 className="mt-10 font-display text-[1.5rem] font-medium text-charcoal">
        Social profiles
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Field label="Instagram URL" hint="Leave empty to hide the icon">
          <TextInput
            value={data.socials.instagram ?? ""}
            onChange={(e) =>
              set("socials", { ...data.socials, instagram: e.target.value || null })
            }
          />
        </Field>
        <Field label="Facebook URL" hint="Leave empty to hide the icon">
          <TextInput
            value={data.socials.facebook ?? ""}
            onChange={(e) =>
              set("socials", { ...data.socials, facebook: e.target.value || null })
            }
          />
        </Field>
      </div>

      <SaveBar dirty={dirty} onSave={() => saveSite(data)} />
    </div>
  );
}
