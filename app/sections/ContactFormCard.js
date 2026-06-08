"use client";

import Image from "next/image";
import { useState } from "react";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service" },
  { value: "ai-agents", label: "AI Agents & Automation" },
  { value: "ai-saas", label: "AI SaaS Products" },
  { value: "custom-dev", label: "Custom Software Development" },
  { value: "data-ml", label: "Data & ML Engineering" },
  { value: "cloud", label: "Cloud & DevOps" },
  { value: "design", label: "Product Design & UX" },
  { value: "other", label: "Other" },
];

function UnderlineField({ label, name, type = "text", required, value, onChange, autoComplete, placeholder }) {
  return (
    <label data-cf className="block min-w-0 will-change-[opacity,transform]">
      <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete ?? "off"}
        placeholder={placeholder}
        suppressHydrationWarning
        className="mt-0.5 block w-full border-0 border-b border-white/35 bg-transparent py-1.5 text-[13px] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-(--hero-accent)"
      />
    </label>
  );
}

function UnderlineSelect({ label, name, value, onChange, options, required }) {
  return (
    <label data-cf className="block min-w-0 will-change-[opacity,transform]">
      <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">{label}</span>
      <div className="relative mt-0.5">
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          suppressHydrationWarning
          className="block w-full min-w-0 cursor-pointer appearance-none border-0 border-b border-white/35 bg-transparent py-1.5 pr-8 text-[13px] text-white outline-none transition-colors duration-200 focus:border-(--hero-accent) [&>option]:bg-neutral-900 [&>option]:text-white"
        >
          {options.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 bottom-2 text-xs text-white/40" aria-hidden>
          ▾
        </span>
      </div>
    </label>
  );
}

const initialValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

/**
 * The lime "Let's Build Together!" card body — heading + the 5-field inquiry
 * form (Name / Email / Phone / Service / Message) + lime submit. Pure content:
 * the glass shell + reveal/footer-slide animation live in the parent, which
 * drives motion via the `[data-cf]` fields rendered here. Shared by the homepage
 * `ContactSection` (endZone) and the dedicated /contact page (FooterReveal stage).
 */
export default function ContactFormCard() {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Wire to backend later. */
  };

  return (
    <>
      <h2
        className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] pb-[0.15em] text-hero-gradient"
      >
        Let&apos;s Build
        <br />
        Together!
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-y-2.5">
        <UnderlineField
          label="Name"
          name="name"
          required
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          placeholder="Your name"
        />
        <UnderlineField
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <UnderlineField
          label="Phone"
          name="phone"
          type="tel"
          required={false}
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="+00 000 0000000"
        />
        <UnderlineSelect
          label="Service"
          name="service"
          value={values.service}
          onChange={handleChange}
          options={SERVICE_OPTIONS}
          required
        />
        <label data-cf className="block min-w-0 will-change-[opacity,transform]">
          <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">
            Message <span className="font-normal text-white/50">(Optional)</span>
          </span>
          <textarea
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            placeholder="How can we help?"
            suppressHydrationWarning
            className="mt-0.5 block max-h-24 min-h-16 w-full resize-y border-0 border-b border-white/35 bg-transparent py-1.5 text-[13px] leading-relaxed text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-(--hero-accent)"
          />
        </label>

        <div data-cf className="flex justify-center pt-4 will-change-[opacity,transform]">
          <button type="submit" className="header-cta header-cta--lime" aria-label="Submit">
            <Image
              src="/images/logo-black.png"
              alt=""
              width={22}
              height={22}
              className="h-[1.2em] w-auto object-contain"
              aria-hidden
            />
            <span>Submit</span>
          </button>
        </div>
      </form>
    </>
  );
}
