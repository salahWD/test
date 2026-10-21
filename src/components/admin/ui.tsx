"use client";

import { useState, useTransition } from "react";
import type { SaveResult } from "@/app/admin/actions";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-charcoal-60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[12.5px] text-charcoal-60">{hint}</p>}
    </label>
  );
}

const inputCls =
  "w-full border border-tahini bg-cream px-3.5 py-2.5 text-[15px] text-charcoal outline-none transition-colors duration-250 focus:border-olive";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`${inputCls} leading-relaxed ${props.className ?? ""}`}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-charcoal">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-forest)]"
      />
      {label}
    </label>
  );
}

export function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-[12px] font-semibold uppercase tracking-[0.08em] text-charcoal-60 underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:text-gold-ink"
    >
      Remove
    </button>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-olive px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-forest transition-colors duration-250 hover:bg-garlic"
    >
      + {children}
    </button>
  );
}

/**
 * Sticky save bar: runs the server action in a transition and reports
 * success or the first validation error.
 */
export function SaveBar({
  onSave,
  dirty,
}: {
  onSave: () => Promise<SaveResult>;
  dirty: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null);

  const submit = () =>
    startTransition(async () => {
      try {
        const result = await onSave();
        setStatus(
          result.ok
            ? { ok: true, message: "Saved — the site is updated." }
            : { ok: false, message: result.error },
        );
      } catch {
        setStatus({ ok: false, message: "Save failed — are you still signed in?" });
      }
    });

  return (
    <div className="sticky bottom-0 z-10 -mx-5 mt-10 border-t border-tahini bg-cream/95 px-5 py-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-full bg-forest px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-colors duration-250 hover:bg-forest-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {status && (
          <p
            role="status"
            className={`text-[14px] font-medium ${status.ok ? "text-forest" : "text-gold-ink"}`}
          >
            {status.message}
          </p>
        )}
        {!status && dirty && (
          <p className="text-[14px] text-charcoal-60">Unsaved changes</p>
        )}
      </div>
    </div>
  );
}
