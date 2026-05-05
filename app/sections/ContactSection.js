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
    <label className="block min-w-0">
      <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete ?? "off"}
        placeholder={placeholder}
        className="mt-0.5 block w-full border-0 border-b border-white/35 bg-transparent py-1 text-[13px] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-(--hero-accent)"
      />
    </label>
  );
}

function UnderlineSelect({ label, name, value, onChange, options, required }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">{label}</span>
      <div className="relative mt-0.5">
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className="block w-full min-w-0 cursor-pointer appearance-none border-0 border-b border-white/35 bg-transparent py-1 pr-8 text-[13px] text-white outline-none transition-colors duration-200 focus:border-(--hero-accent) [&>option]:bg-neutral-900 [&>option]:text-white"
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
 * In-page contact (`#contact`) on home / team / services — centered glass form per design.
 * Full two-column experience stays on `/contact` (`ContactPageClient`).
 */
export default function ContactSection() {
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
    <section
      id="contact"
      className="relative isolate z-10 scroll-mt-20 overflow-x-hidden px-4 py-7 sm:px-6 md:px-8 md:py-9"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/default-contact-section-bg.jpg"
          alt=""
          fill
          className="object-cover object-center grayscale contrast-[0.92] brightness-[0.88]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-neutral-950/78 via-neutral-900/68 to-neutral-950/82"
          aria-hidden
        />
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border border-white/12 bg-white/7 px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-5 sm:py-5 md:rounded-2xl md:px-6 md:py-6">
          <h2 className="text-center font-heading text-base font-semibold tracking-[0.05em] text-white md:text-lg">
            Let&apos;s Build Together!
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-y-3"
          >
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
            <label className="block min-w-0 sm:col-span-2">
              <span className="block text-[11px] font-medium tracking-[0.06em] text-white/85">
                Message <span className="font-normal text-white/50">(Optional)</span>
              </span>
              <textarea
                name="message"
                rows={1}
                value={values.message}
                onChange={handleChange}
                placeholder="How can we help?"
                className="mt-0.5 block min-h-10 max-h-24 w-full resize-y border-0 border-b border-white/35 bg-transparent py-1 text-[13px] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-(--hero-accent)"
              />
            </label>

            <div className="flex justify-end sm:col-span-2 sm:pt-0.5">
              <button type="submit" className="header-contact-btn" aria-label="Submit">
                <span className="header-contact-btn__icon" aria-hidden>
                  <Image
                    src="/images/Icon Gradient.png"
                    alt=""
                    width={26}
                    height={25}
                    className="header-contact-btn__icon-img"
                  />
                </span>
                <span className="relative z-1">Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
