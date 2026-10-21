"use client";

import { useState } from "react";
import { saveFaq } from "@/app/admin/actions";
import type { FaqItem } from "@/lib/content";
import { Field, TextInput, TextArea, RemoveButton, AddButton, SaveBar } from "./ui";

export default function FaqEditor({ initial }: { initial: FaqItem[] }) {
  const [list, setList] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const set = (id: string, patch: Partial<FaqItem>) => {
    setList((l) => l.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setDirty(true);
  };

  const remove = (id: string) => {
    setList((l) => l.filter((f) => f.id !== id));
    setDirty(true);
  };

  const add = () => {
    setList((l) => [
      ...l,
      { id: `faq-${Date.now().toString(36)}`, question: "", answer: "" },
    ]);
    setDirty(true);
  };

  return (
    <div className="max-w-[760px] space-y-6">
      {list.map((f, i) => (
        <div key={f.id} className="border border-tahini bg-garlic p-5">
          <Field label={`Question ${i + 1}`}>
            <TextInput
              value={f.question}
              onChange={(e) => set(f.id, { question: e.target.value })}
            />
          </Field>
          <div className="mt-4">
            <Field label="Answer">
              <TextArea
                value={f.answer}
                onChange={(e) => set(f.id, { answer: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4 text-right">
            <RemoveButton onClick={() => remove(f.id)} label={`Remove question ${i + 1}`} />
          </div>
        </div>
      ))}
      <AddButton onClick={add}>Add question</AddButton>
      <SaveBar dirty={dirty} onSave={() => saveFaq(list)} />
    </div>
  );
}
