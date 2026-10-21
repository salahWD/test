"use client";

import { useState } from "react";
import type { ContactInput } from "@/lib/contact-schema";

/**
 * Zero-dependency form: the ~75 KB react-hook-form + zod pair is deliberate
 * overkill for four fields, and this chunk gets PREFETCHED by every page
 * that links to /contact (all of them). Client-side checks below mirror
 * `lib/contact-schema.ts` 1:1 — the zod schema stays the authoritative
 * contract where it matters, in the API route.
 */

const inputCls =
  "w-full border border-tahini bg-cream px-4 py-3 text-[15px] text-charcoal " +
  "placeholder:text-charcoal-60/60 transition-[border-color,box-shadow] duration-250 " +
  "focus:border-olive focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink";

type Errors = Partial<Record<keyof ContactInput, string>>;

/** Mirrors contactSchema (name ≥2, valid email, message ≥10; maxima native). */
function validate(data: ContactInput): Errors {
  const errors: Errors = {};
  if (data.name.trim().length < 2) errors.name = "Please tell us your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "That email doesn't look right";
  if (data.message.trim().length < 10)
    errors.message = "Give us a little more to go on";
  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: ContactInput = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const nextErrors = validate(data);
    setErrors(nextErrors);
    const firstInvalid = (["name", "email", "message"] as const).find(
      (k) => nextErrors[k],
    );
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow mb-2 block text-charcoal-60">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            className={inputCls}
          />
          {errors.name && (
            <p id="cf-name-err" role="alert" className="mt-1.5 text-[13px] text-gold-ink">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow mb-2 block text-charcoal-60">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            className={inputCls}
          />
          {errors.email && (
            <p id="cf-email-err" role="alert" className="mt-1.5 text-[13px] text-gold-ink">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cf-phone" className="eyebrow mb-2 block text-charcoal-60">
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="eyebrow mb-2 block text-charcoal-60">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          maxLength={4000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          className={inputCls}
        />
        {errors.message && (
          <p id="cf-message-err" role="alert" className="mt-1.5 text-[13px] text-gold-ink">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-forest-deep hover:shadow-[inset_0_0_0_1px_var(--color-gold)] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          <span
            aria-hidden
            className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
          >
            →
          </span>
        </button>
        <p aria-live="polite" className="text-[14px] text-charcoal-60">
          {status === "sent" && "Thank you — we'll get back to you soon."}
          {status === "error" &&
            "Something went sideways. Please call us instead."}
        </p>
      </div>
    </form>
  );
}
