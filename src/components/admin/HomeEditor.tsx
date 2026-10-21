"use client";

import { useState } from "react";
import { saveHome } from "@/app/admin/actions";
import type { HomeContent } from "@/lib/content";
import { Field, TextInput, TextArea, RemoveButton, AddButton, SaveBar } from "./ui";

/**
 * Home-page copy editor: hero lines, the mouneh corner (intro + goods +
 * shelf tags + note), and the final call-to-action. Structure/images stay
 * code-owned; this is purely the words.
 */
export default function HomeEditor({ initial }: { initial: HomeContent }) {
  const [home, setHome] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const patch = (next: Partial<HomeContent>) => {
    setHome((h) => ({ ...h, ...next }));
    setDirty(true);
  };

  const setList = (key: "goods" | "tags", i: number, value: string) =>
    patch({
      mouneh: {
        ...home.mouneh,
        [key]: home.mouneh[key].map((v, j) => (j === i ? value : v)),
      },
    });

  const removeFromList = (key: "goods" | "tags", i: number) =>
    patch({
      mouneh: {
        ...home.mouneh,
        [key]: home.mouneh[key].filter((_, j) => j !== i),
      },
    });

  const addToList = (key: "goods" | "tags") =>
    patch({ mouneh: { ...home.mouneh, [key]: [...home.mouneh[key], ""] } });

  return (
    <div className="max-w-[760px] space-y-8">
      {/* ——— hero ——— */}
      <section className="border border-tahini bg-garlic p-5">
        <h2 className="font-display text-[1.4rem] font-medium text-charcoal">
          Hero (top of the page)
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Small line above the headline">
            <TextInput
              value={home.hero.eyebrow}
              onChange={(e) =>
                patch({ hero: { ...home.hero, eyebrow: e.target.value } })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Headline — first line">
              <TextInput
                value={home.hero.headlineTop}
                onChange={(e) =>
                  patch({ hero: { ...home.hero, headlineTop: e.target.value } })
                }
              />
            </Field>
            <Field label="Headline — second line (italic)">
              <TextInput
                value={home.hero.headlineBottom}
                onChange={(e) =>
                  patch({
                    hero: { ...home.hero, headlineBottom: e.target.value },
                  })
                }
              />
            </Field>
          </div>
          <Field
            label="Mid-scroll caption"
            hint="The italic line that floats through while the film plays."
          >
            <TextInput
              value={home.hero.caption}
              onChange={(e) =>
                patch({ hero: { ...home.hero, caption: e.target.value } })
              }
            />
          </Field>
        </div>
      </section>

      {/* ——— mouneh corner ——— */}
      <section className="border border-tahini bg-garlic p-5">
        <h2 className="font-display text-[1.4rem] font-medium text-charcoal">
          The mouneh corner
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Intro paragraph">
            <TextArea
              value={home.mouneh.intro}
              onChange={(e) =>
                patch({ mouneh: { ...home.mouneh, intro: e.target.value } })
              }
            />
          </Field>

          <div>
            <span className="eyebrow text-charcoal-60">
              What&rsquo;s on the shelves (shown on computers)
            </span>
            <p className="mt-1 text-[12.5px] text-charcoal-60">
              One line per item — these appear as the bulleted list.
            </p>
            <div className="mt-2 space-y-2">
              {home.mouneh.goods.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    value={g}
                    aria-label={`Shelf item ${i + 1}`}
                    onChange={(e) => setList("goods", i, e.target.value)}
                  />
                  <RemoveButton
                    onClick={() => removeFromList("goods", i)}
                    label={`Remove shelf item ${i + 1}`}
                  />
                </div>
              ))}
              <AddButton onClick={() => addToList("goods")}>
                Add shelf item
              </AddButton>
            </div>
          </div>

          <div>
            <span className="eyebrow text-charcoal-60">
              Shelf tags (shown on phones)
            </span>
            <p className="mt-1 text-[12.5px] text-charcoal-60">
              Short versions — a couple of words each; people swipe through
              them.
            </p>
            <div className="mt-2 space-y-2">
              {home.mouneh.tags.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    value={t}
                    aria-label={`Shelf tag ${i + 1}`}
                    onChange={(e) => setList("tags", i, e.target.value)}
                  />
                  <RemoveButton
                    onClick={() => removeFromList("tags", i)}
                    label={`Remove shelf tag ${i + 1}`}
                  />
                </div>
              ))}
              <AddButton onClick={() => addToList("tags")}>Add tag</AddButton>
            </div>
          </div>

          <Field label="In-store note">
            <TextInput
              value={home.mouneh.note}
              onChange={(e) =>
                patch({ mouneh: { ...home.mouneh, note: e.target.value } })
              }
            />
          </Field>
        </div>
      </section>

      {/* ——— final CTA ——— */}
      <section className="border border-tahini bg-garlic p-5">
        <h2 className="font-display text-[1.4rem] font-medium text-charcoal">
          Bottom of the page (order call-out)
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Small line above the headline">
            <TextInput
              value={home.finalCta.eyebrow}
              onChange={(e) =>
                patch({ finalCta: { ...home.finalCta, eyebrow: e.target.value } })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Headline — first line">
              <TextInput
                value={home.finalCta.headlineTop}
                onChange={(e) =>
                  patch({
                    finalCta: { ...home.finalCta, headlineTop: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline — second line (italic)">
              <TextInput
                value={home.finalCta.headlineItalic}
                onChange={(e) =>
                  patch({
                    finalCta: {
                      ...home.finalCta,
                      headlineItalic: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <Field
            label="Body line"
            hint="The online-ordering hours are added automatically after it."
          >
            <TextArea
              value={home.finalCta.body}
              onChange={(e) =>
                patch({ finalCta: { ...home.finalCta, body: e.target.value } })
              }
            />
          </Field>
        </div>
      </section>

      <SaveBar dirty={dirty} onSave={() => saveHome(home)} />
    </div>
  );
}
