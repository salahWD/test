"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMenuImage } from "@/app/admin/actions";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Photo control for a menu item: upload / replace / remove. Uploading stores
 * the file immediately (R2 or local fallback) and hands the URL to the
 * editor's local state — nothing reaches the public site until the owner
 * saves the menu. "Remove" only clears the field; unreferenced files are
 * cleaned up server-side after the next save.
 */
export default function ImageField({
  itemId,
  itemName,
  value,
  onChange,
}: {
  itemId: string;
  itemName: string;
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // re-selecting the same file must refire
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Photo is over 8 MB — please use a smaller image.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("itemId", itemId || itemName || "item");
        const result = await uploadMenuImage(fd);
        if (result.ok) onChange(result.url);
        else setError(result.error);
      } catch {
        setError("Upload failed — are you still signed in?");
      }
    });
  };

  const buttonCls =
    "rounded-full border border-olive px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-forest transition-colors duration-250 hover:bg-cream disabled:opacity-60";

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="sr-only"
        aria-label={`Photo for ${itemName || "menu item"}`}
      />
      <div className="flex flex-wrap items-center gap-4">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element -- admin-only
          // preview; plain img avoids optimizer/remotePatterns coupling in dev
          <img
            src={value}
            alt=""
            className="h-20 w-32 rounded-[8px] border border-tahini object-cover"
          />
        )}
        <div className="flex items-center gap-4">
          <button type="button" onClick={pick} disabled={pending} className={buttonCls}>
            {pending ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
          </button>
          {value && !pending && (
            <button
              type="button"
              onClick={() => {
                setError(null);
                onChange(undefined);
              }}
              className="text-[12px] font-semibold uppercase tracking-[0.08em] text-charcoal-60 underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:text-gold-ink"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>
      {error && (
        <p role="status" className="mt-2 text-[13px] font-medium text-gold-ink">
          {error}
        </p>
      )}
    </div>
  );
}
