"use client";

import { useState } from "react";
import { saveMenuAndCategories } from "@/app/admin/actions";
import { DIETARY } from "@/lib/cms/schema";
import type { MenuCategory, MenuItem } from "@/lib/content";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
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
 * Price field with its own text state so intermediate keystrokes ("13.")
 * survive — a controlled number round-trip would swallow the decimal point.
 * Commits a number (or null = "ask in store") on every valid keystroke.
 */
function PriceInput({
  value,
  onCommit,
}: {
  value: number | null;
  onCommit: (v: number | null) => void;
}) {
  const [text, setText] = useState(value === null ? "" : String(value));
  return (
    <TextInput
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const v = e.target.value.trim();
        if (!/^\d*\.?\d{0,2}$/.test(v)) return; // digits, one dot, ≤2 decimals
        setText(v);
        const n = Number(v);
        onCommit(v === "" || !Number.isFinite(n) ? null : n);
      }}
      onBlur={() => {
        if (text.endsWith(".")) setText(text.slice(0, -1));
      }}
    />
  );
}

export default function MenuEditor({
  initialCategories,
  initialMenu,
}: {
  initialCategories: MenuCategory[];
  initialMenu: MenuItem[];
}) {
  const [cats, setCats] = useState(initialCategories);
  const [items, setItems] = useState(initialMenu);
  const [open, setOpen] = useState<string | null>(initialCategories[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);

  const touch = () => setDirty(true);

  const setItem = (id: string, patch: Partial<MenuItem>) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    touch();
  };

  const removeItem = (id: string) => {
    setItems((list) => list.filter((it) => it.id !== id));
    touch();
  };

  const addItem = (category: MenuCategory["id"]) => {
    const base: MenuItem = {
      id: `new-item-${items.length + 1}`,
      category,
      name: "",
      description: "",
      price: 0,
      dietary: [],
    };
    setItems((list) => [...list, base]);
    touch();
  };

  const setCat = (id: string, patch: Partial<MenuCategory>) => {
    setCats((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    touch();
  };

  const save = async () => {
    // stabilize ids from names for newly added items, never colliding with
    // an existing id (two "Falafel Wrap"s must not share React keys)
    const taken = new Set(
      items.filter((it) => !it.id.startsWith("new-item-")).map((it) => it.id),
    );
    const normalized = items.map((it) => {
      if (!it.id.startsWith("new-item-") || !it.name) return it;
      const base = slug(it.name) || it.id;
      let id = base;
      for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
      taken.add(id);
      return { ...it, id };
    });
    const result = await saveMenuAndCategories(cats, normalized);
    if (result.ok) setItems(normalized);
    return result;
  };

  return (
    <div>
      {cats.map((cat) => {
        const catItems = items.filter((it) => it.category === cat.id);
        const expanded = open === cat.id;
        return (
          <section key={cat.id} className="border-b border-tahini py-2">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : cat.id)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-3 text-left"
            >
              <span className="font-display text-[1.6rem] font-medium text-charcoal">
                {cat.label}{" "}
                <span className="ml-2 text-[13px] font-body text-charcoal-60">
                  {catItems.length} items
                </span>
              </span>
              <span aria-hidden className="text-[1.3rem] text-charcoal-60">
                {expanded ? "–" : "+"}
              </span>
            </button>

            {expanded && (
              <div className="space-y-6 pb-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Category label">
                    <TextInput
                      value={cat.label}
                      onChange={(e) => setCat(cat.id, { label: e.target.value })}
                    />
                  </Field>
                  <Field
                    label="Category add-on offer (optional)"
                    hint="Shown as the green pill under the category title, e.g. “Add extra protein to any wrap · $4.99”"
                  >
                    <TextInput
                      value={cat.note ?? ""}
                      onChange={(e) =>
                        setCat(cat.id, { note: e.target.value || undefined })
                      }
                    />
                  </Field>
                </div>

                {catItems.map((it) => (
                  <div key={it.id} className="border border-tahini bg-garlic p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_130px_130px]">
                      <Field label="Name">
                        <TextInput
                          value={it.name}
                          onChange={(e) => setItem(it.id, { name: e.target.value })}
                        />
                      </Field>
                      <Field label="Price ($)" hint="Empty = “ask in store”">
                        <PriceInput
                          key={it.id}
                          value={it.price}
                          onCommit={(price) => setItem(it.id, { price })}
                        />
                      </Field>
                      <Field label="Price note" hint="e.g. “3 for”">
                        <TextInput
                          value={it.priceNote ?? ""}
                          onChange={(e) =>
                            setItem(it.id, { priceNote: e.target.value || undefined })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Description">
                        <TextArea
                          value={it.description}
                          onChange={(e) =>
                            setItem(it.id, { description: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field
                        label="Add-on offer (optional)"
                        hint="Shown as a highlighted chip on this item’s card, e.g. “Extra skewer · $7.50”"
                      >
                        <TextInput
                          value={it.addOn ?? ""}
                          onChange={(e) =>
                            setItem(it.id, { addOn: e.target.value || undefined })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field
                        label="Photo"
                        hint="Shown on the menu page. Landscape photos look best — big files are resized automatically. Save changes to publish."
                      >
                        <ImageField
                          itemId={it.id}
                          itemName={it.name}
                          value={it.image}
                          onChange={(image) => setItem(it.id, { image })}
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {DIETARY.map((d) => (
                        <Checkbox
                          key={d}
                          label={d}
                          checked={it.dietary.includes(d)}
                          onChange={(on) =>
                            setItem(it.id, {
                              dietary: on
                                ? [...it.dietary, d]
                                : it.dietary.filter((x) => x !== d),
                            })
                          }
                        />
                      ))}
                      <Checkbox
                        label="house favorite"
                        checked={Boolean(it.featured)}
                        onChange={(on) =>
                          setItem(it.id, { featured: on || undefined })
                        }
                      />
                      <span className="ml-auto">
                        <RemoveButton
                          onClick={() => removeItem(it.id)}
                          label={`Remove ${it.name || "item"}`}
                        />
                      </span>
                    </div>
                  </div>
                ))}

                <AddButton onClick={() => addItem(cat.id)}>
                  Add item to {cat.label}
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
