"use client";

import { useState } from "react";
import { saveCatering } from "@/app/admin/actions";
import type { CateringSection, CateringItem } from "@/lib/content";
import {
  Field,
  TextInput,
  TextArea,
  RemoveButton,
  AddButton,
  SaveBar,
} from "./ui";
import ImageField from "./ImageField";

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Tray price with its own text state so intermediate keystrokes ("59.")
 * survive the controlled round-trip. Catering prices are required — the
 * field restores itself on blur if left empty.
 */
function TrayPriceInput({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  return (
    <TextInput
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const v = e.target.value.trim();
        if (!/^\d*\.?\d{0,2}$/.test(v)) return;
        setText(v);
        const n = Number(v);
        if (v !== "" && Number.isFinite(n)) onCommit(n);
      }}
      onBlur={() => {
        if (text === "" || text.endsWith(".")) setText(String(value));
      }}
    />
  );
}

export default function CateringEditor({
  initialSections,
  initialLeadTime,
}: {
  initialSections: CateringSection[];
  initialLeadTime: string;
}) {
  const [sections, setSections] = useState(initialSections);
  const [leadTime, setLeadTime] = useState(initialLeadTime);
  const [open, setOpen] = useState<string | null>(initialSections[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);

  const touch = () => setDirty(true);

  const setSection = (id: string, patch: Partial<CateringSection>) => {
    setSections((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    touch();
  };

  const setItem = (sectionId: string, itemId: string, patch: Partial<CateringItem>) => {
    setSections((list) =>
      list.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
            }
          : s,
      ),
    );
    touch();
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setSections((list) =>
      list.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
          : s,
      ),
    );
    touch();
  };

  const addItem = (sectionId: string) => {
    setSections((list) =>
      list.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [
                ...s.items,
                { id: `new-tray-${s.items.length + 1}`, name: "", price: 0 },
              ],
            }
          : s,
      ),
    );
    touch();
  };

  const save = async () => {
    // stabilize ids from names for newly added trays, never colliding
    const taken = new Set(
      sections.flatMap((s) => s.items.filter((it) => !it.id.startsWith("new-tray-")).map((it) => it.id)),
    );
    const normalized = sections.map((s) => ({
      ...s,
      items: s.items.map((it) => {
        if (!it.id.startsWith("new-tray-") || !it.name) return it;
        const base = slug(it.name) || it.id;
        let id = base;
        for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
        taken.add(id);
        return { ...it, id };
      }),
    }));
    const result = await saveCatering(normalized, leadTime);
    if (result.ok) setSections(normalized);
    return result;
  };

  return (
    <div>
      <div className="mb-8 max-w-[520px]">
        <Field
          label="Lead-time note"
          hint="Shown beside every catering call-to-action"
        >
          <TextInput
            value={leadTime}
            onChange={(e) => {
              setLeadTime(e.target.value);
              touch();
            }}
          />
        </Field>
      </div>

      {sections.map((section) => {
        const expanded = open === section.id;
        return (
          <section key={section.id} className="border-b border-tahini py-2">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : section.id)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-3 text-left"
            >
              <span className="font-display text-[1.6rem] font-medium text-charcoal">
                {section.label}{" "}
                <span className="ml-2 font-body text-[13px] text-charcoal-60">
                  {section.items.length} items
                </span>
              </span>
              <span aria-hidden className="text-[1.3rem] text-charcoal-60">
                {expanded ? "–" : "+"}
              </span>
            </button>

            {expanded && (
              <div className="space-y-6 pb-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Section label">
                    <TextInput
                      value={section.label}
                      onChange={(e) => setSection(section.id, { label: e.target.value })}
                    />
                  </Field>
                  <Field label="Section note (e.g. “Each serves 10”, optional)">
                    <TextInput
                      value={section.note ?? ""}
                      onChange={(e) =>
                        setSection(section.id, { note: e.target.value || undefined })
                      }
                    />
                  </Field>
                </div>

                {section.items.map((item) => (
                  <div key={item.id} className="border border-tahini bg-garlic p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
                      <Field label="Name" hint="Include the count, e.g. “· 25 pieces”">
                        <TextInput
                          value={item.name}
                          onChange={(e) =>
                            setItem(section.id, item.id, { name: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Price ($)">
                        <TrayPriceInput
                          key={item.id}
                          value={item.price}
                          onCommit={(price) => setItem(section.id, item.id, { price })}
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Description (optional)">
                        <TextArea
                          rows={2}
                          value={item.description ?? ""}
                          onChange={(e) =>
                            setItem(section.id, item.id, {
                              description: e.target.value || undefined,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field
                        label="Photo"
                        hint="Shown beside the tray on the catering page. Landscape photos look best — big files are resized automatically. Save changes to publish."
                      >
                        <ImageField
                          itemId={item.id}
                          itemName={item.name}
                          value={item.image}
                          onChange={(image) => setItem(section.id, item.id, { image })}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 text-right">
                      <RemoveButton
                        onClick={() => removeItem(section.id, item.id)}
                        label={`Remove ${item.name || "tray"}`}
                      />
                    </div>
                  </div>
                ))}

                <AddButton onClick={() => addItem(section.id)}>
                  Add tray to {section.label}
                </AddButton>
              </div>
            )}
          </section>
        );
      })}

      <SaveBar dirty={dirty} onSave={save} />
    </div>
  );
}
