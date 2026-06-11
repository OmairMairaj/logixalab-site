"use client";

import Image from "next/image";
import { useState } from "react";

const TIME_ZONE_OPTIONS = [
  { value: "", label: "Time Zone" },
  { value: "PKT (UTC+5)", label: "PKT — Pakistan (UTC+5)" },
  { value: "GST (UTC+4)", label: "GST — UAE / Gulf (UTC+4)" },
  { value: "IST (UTC+5:30)", label: "IST — India (UTC+5:30)" },
  { value: "GMT (UTC+0)", label: "GMT — UK (UTC+0)" },
  { value: "CET (UTC+1)", label: "CET — Europe (UTC+1)" },
  { value: "EST (UTC-5)", label: "EST — US East (UTC-5)" },
  { value: "CST (UTC-6)", label: "CST — US Central (UTC-6)" },
  { value: "MST (UTC-7)", label: "MST — US Mountain (UTC-7)" },
  { value: "PST (UTC-8)", label: "PST — US West (UTC-8)" },
  { value: "AEST (UTC+10)", label: "AEST — Australia East (UTC+10)" },
];

const TIME_SLOT_OPTIONS = [
  { value: "", label: "Preferred Time Slot (optional)" },
  { value: "Morning (9am–12pm)", label: "Morning (9am – 12pm)" },
  { value: "Midday (12pm–3pm)", label: "Midday (12pm – 3pm)" },
  { value: "Afternoon (3pm–6pm)", label: "Afternoon (3pm – 6pm)" },
  { value: "Evening (6pm–9pm)", label: "Evening (6pm – 9pm)" },
];

/* Shared input styling — placeholder doubles as the field label (matching the
   minimal underline design), so every control reads the same across the grid. */
const CONTROL_CLASS =
  "block w-full min-w-0 border-0 border-b border-white/25 bg-transparent pb-2 text-[15px] text-white outline-none transition-colors duration-200 placeholder:text-white/55 focus:border-(--hero-accent)";

/** Underline text/email/tel field. The label IS the placeholder (with an
 *  sr-only label kept for accessibility / autofill). */
function Field({ label, name, type = "text", required, value, onChange, autoComplete, span }) {
  return (
    <label
      data-cf
      className={`block min-w-0 will-change-[opacity,transform]${span ? " sm:col-span-2" : ""}`}
    >
      <span className="sr-only">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete ?? "off"}
        placeholder={label}
        aria-label={label}
        suppressHydrationWarning
        className={CONTROL_CLASS}
      />
    </label>
  );
}

/** Underline select with a chevron; the disabled first option acts as the
 *  placeholder/label so it matches the text fields. */
function SelectField({ label, name, value, onChange, options, required, span }) {
  return (
    <label
      data-cf
      className={`block min-w-0 will-change-[opacity,transform]${span ? " sm:col-span-2" : ""}`}
    >
      <span className="sr-only">{label}</span>
      <div className="relative">
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          aria-label={label}
          suppressHydrationWarning
          className={`${CONTROL_CLASS} cursor-pointer appearance-none pr-8 ${
            value ? "text-white" : "text-white/55"
          } [&>option]:bg-neutral-900 [&>option]:text-white`}
        >
          {options.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 bottom-2 text-xs text-white/45" aria-hidden>
          ▾
        </span>
      </div>
    </label>
  );
}

/** Preferred-date field — shows the "Preferred Date (optional)" label as a plain
 *  text-input placeholder (matching every other field) while empty + unfocused,
 *  then swaps to a native date picker on focus / once a date is set. No overlay,
 *  so the label and the native mm/dd/yyyy can never overlap. `value` stays
 *  controlled the whole time, so React's controlled state never flips. */
function DateField({ label, name, value, onChange, span }) {
  const [picking, setPicking] = useState(false);
  const asDate = picking || Boolean(value);
  return (
    <label
      data-cf
      className={`block min-w-0 will-change-[opacity,transform]${span ? " sm:col-span-2" : ""}`}
    >
      <span className="sr-only">{label}</span>
      <input
        type={asDate ? "date" : "text"}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setPicking(true)}
        onBlur={(e) => {
          if (!e.target.value) setPicking(false);
        }}
        placeholder={label}
        aria-label={label}
        suppressHydrationWarning
        className={`${CONTROL_CLASS} [color-scheme:dark]`}
      />
    </label>
  );
}

const initialValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  preferredDate: "",
  timeZone: "",
  preferredTimeSlot: "",
};

/**
 * The "Let's Build Together!" card body — heading + the inquiry form in a
 * two-column underline layout (Name / Company · Email / Phone · How may we help ·
 * Preferred Date / Time Zone · Preferred Time Slot) + lime submit. Pure content:
 * the glass shell + reveal/footer-slide animation live in the parent, which
 * drives motion via the `[data-cf]` fields rendered here. Shared by the homepage
 * `ContactSection` (endZone) and the dedicated /contact page (FooterReveal stage).
 */
export default function ContactFormCard() {
  const [values, setValues] = useState(initialValues);
  // status: "idle" | "submitting" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      setStatus("success");
      setFeedback("Thanks! Your message has been sent — we'll be in touch shortly.");
      setValues(initialValues);
    } catch (err) {
      setStatus("error");
      setFeedback(err.message || "Couldn't send your message. Please try again.");
    }
  };

  return (
    <>
      <h2 className="font-heading text-center text-[clamp(1.9rem,3.4vw,2.9rem)] font-normal leading-[1.1] tracking-[-0.02em] pb-[0.15em] text-hero-gradient">
        Let&apos;s Build Together!
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2"
      >
        <Field
          label="Your Name"
          name="name"
          required
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <Field
          label="Company Name"
          name="company"
          required
          value={values.company}
          onChange={handleChange}
          autoComplete="organization"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <Field
          label="Phone Number (optional)"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        <Field
          label="How may we help you?"
          name="message"
          required
          value={values.message}
          onChange={handleChange}
          span
        />
        <DateField
          label="Preferred Date (optional)"
          name="preferredDate"
          value={values.preferredDate}
          onChange={handleChange}
        />
        <SelectField
          label="Time Zone"
          name="timeZone"
          required
          value={values.timeZone}
          onChange={handleChange}
          options={TIME_ZONE_OPTIONS}
        />
        <SelectField
          label="Preferred Time Slot (optional)"
          name="preferredTimeSlot"
          value={values.preferredTimeSlot}
          onChange={handleChange}
          options={TIME_SLOT_OPTIONS}
          span
        />

        <div
          data-cf
          className="flex flex-col items-center gap-3 pt-4 will-change-[opacity,transform] sm:col-span-2"
        >
          <button
            type="submit"
            className="header-cta header-cta--lime disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Submit"
            disabled={status === "submitting"}
          >
            <Image
              src="/images/logo-black.png"
              alt=""
              width={22}
              height={22}
              className="h-[1.2em] w-auto object-contain"
              aria-hidden
            />
            <span>{status === "submitting" ? "Sending…" : "Submit"}</span>
          </button>

          {feedback ? (
            <p
              role="status"
              aria-live="polite"
              className={`text-center text-[12px] leading-relaxed ${
                status === "error" ? "text-red-300" : "text-(--hero-accent)"
              }`}
            >
              {feedback}
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
}
