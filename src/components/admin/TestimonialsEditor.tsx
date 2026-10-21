"use client";

import { useState } from "react";
import { saveTestimonials } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/content";
import { Field, TextInput, TextArea, RemoveButton, AddButton, SaveBar } from "./ui";

/** Star rating with local text state so the field can be cleared and retyped. */
function StarsInput({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  return (
    <TextInput
      inputMode="numeric"
      value={text}
      onChange={(e) => {
        const v = e.target.value;
        if (!/^[1-5]?$/.test(v)) return;
        setText(v);
        if (v !== "") onCommit(Number(v));
      }}
      onBlur={() => {
        if (text === "") setText(String(value));
      }}
    />
  );
}

export default function TestimonialsEditor({ initial }: { initial: Testimonial[] }) {
  const [list, setList] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const set = (id: string, patch: Partial<Testimonial>) => {
    setList((l) => l.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setDirty(true);
  };

  const remove = (id: string) => {
    setList((l) => l.filter((t) => t.id !== id));
    setDirty(true);
  };

  const add = () => {
    setList((l) => [
      ...l,
      {
        id: `review-${Date.now().toString(36)}`,
        quote: "",
        attribution: "",
        source: "Google review",
        rating: 5,
      },
    ]);
    setDirty(true);
  };

  return (
    <div className="max-w-[760px] space-y-6">
      {list.map((t, i) => (
        <div key={t.id} className="border border-tahini bg-garlic p-5">
          <Field label={`Quote ${i + 1}`}>
            <TextArea
              value={t.quote}
              onChange={(e) => set(t.id, { quote: e.target.value })}
            />
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <TextInput
                value={t.attribution}
                onChange={(e) => set(t.id, { attribution: e.target.value })}
              />
            </Field>
            <Field label="Source (optional)">
              <TextInput
                value={t.source ?? ""}
                onChange={(e) => set(t.id, { source: e.target.value || undefined })}
              />
            </Field>
            <Field label="Date (optional)" hint="When the review was posted, e.g. “March 2026”">
              <TextInput
                value={t.date ?? ""}
                onChange={(e) => set(t.id, { date: e.target.value || undefined })}
              />
            </Field>
            <Field label="Stars (1–5)">
              <StarsInput
                key={t.id}
                value={t.rating ?? 5}
                onCommit={(rating) => set(t.id, { rating })}
              />
            </Field>
          </div>
          <div className="mt-4 text-right">
            <RemoveButton onClick={() => remove(t.id)} label={`Remove quote ${i + 1}`} />
          </div>
        </div>
      ))}
      <AddButton onClick={add}>Add review</AddButton>
      <SaveBar dirty={dirty} onSave={() => saveTestimonials(list)} />
    </div>
  );
}
