"use client";

import Image from "next/image";
import { useState } from "react";

const TIME_ZONES = [
  { value: "", label: "Select time zone" },
  { value: "Asia/Karachi", label: "Asia / Karachi (PKT)" },
  { value: "Asia/Dubai", label: "Asia / Dubai (GST)" },
  { value: "Europe/London", label: "Europe / London (GMT/BST)" },
  { value: "America/New_York", label: "America / New York (ET)" },
  { value: "UTC", label: "UTC" },
];

const TIME_SLOTS = [
  { value: "", label: "Select a slot" },
  { value: "morning", label: "Morning (9:00–12:00)" },
  { value: "afternoon", label: "Afternoon (12:00–17:00)" },
  { value: "evening", label: "Evening (17:00–20:00)" },
];

function UnderlineInput({ label, name, type = "text", required, value, onChange, autoComplete, placeholder }) {
  return (
    <label className="group relative block">
      <span className="block text-[12px] font-medium tracking-wide text-white/80">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete ?? "off"}
        placeholder={placeholder}
        className="mt-0.5 block w-full border-0 border-b border-white/30 bg-transparent py-1.5 text-[15px] text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-(--hero-accent)"
      />
    </label>
  );
}

function UnderlineSelect({ label, name, value, onChange, options, required }) {
  return (
    <label className="group relative block">
      <span className="block text-[12px] font-medium tracking-wide text-white/80">{label}</span>
      <div className="relative mt-0.5">
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className="block w-full cursor-pointer appearance-none border-0 border-b border-white/30 bg-transparent py-1.5 pr-8 text-[15px] text-white outline-none transition-colors duration-200 focus:border-(--hero-accent) [&>option]:bg-neutral-900 [&>option]:text-white"
        >
          {options.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value}>
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

const initialValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  help: "",
  preferredDate: "",
  timeZone: "",
  timeSlot: "",
};

export default function ContactPageClient() {
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
    <div className="relative isolate min-h-screen overflow-x-hidden overflow-y-visible pb-16 pt-16 md:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/contact-page-bg.jpg"
          alt="background image"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="relative z-20 mx-auto flex w-full max-w-[min(100%,1360px)] flex-col gap-12 px-5 py-12 md:px-10 md:py-16 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:py-20 xl:gap-14">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-10 lg:py-2 lg:pr-6">
          <h1 className="font-heading text-balance text-[clamp(2.75rem,6vw,4rem)] font-normal leading-[1.05] tracking-[-0.03em] text-white lg:text-nowrap">
            Let&apos;s Talk
          </h1>
          <address className="not-italic">
            <ul className="flex flex-col gap-3 text-[15px] font-medium leading-snug text-(--hero-accent) md:text-base">
              <li>
                <a href="mailto:info@logixalab.com" className="transition-opacity hover:opacity-85">
                  info@logixalab.com
                </a>
              </li>
              <li>
                <a href="tel:+925498465186" className="transition-opacity hover:opacity-85">
                  +92 549846518 6
                </a>
              </li>
              <li>Address will come here</li>
            </ul>
          </address>
        </div>

        <div className="w-full min-w-0 shrink-0 lg:max-w-[min(100%,35rem)] xl:max-w-2xl">
          <div className="rounded-2xl border border-white/12 bg-black/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6 lg:p-6">
            <h2 className="text-center font-heading text-xl font-normal tracking-[-0.02em] text-white md:text-2xl">
              Let&apos;s Build Together!
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5 sm:gap-4">
              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3.5">
                <UnderlineInput
                  label="Your Name"
                  name="name"
                  required
                  value={values.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your name"
                />
                <UnderlineInput
                  label="Company Name"
                  name="company"
                  required
                  value={values.company}
                  onChange={handleChange}
                  autoComplete="organization"
                  placeholder="Company name"
                />
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3.5">
                <UnderlineInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@company.com"
                />
                <UnderlineInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required={false}
                  value={values.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+00 000 0000000"
                />
              </div>

              <label className="block">
                <span className="block text-[12px] font-medium tracking-wide text-white/80">
                  How may we help you?
                </span>
                <textarea
                  name="help"
                  required
                  rows={2}
                  value={values.help}
                  onChange={handleChange}
                  placeholder="Tell us about your project"
                  className="mt-0.5 max-h-24 min-h-13 block w-full resize-y border-0 border-b border-white/30 bg-transparent py-1.5 text-[15px] leading-snug text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-(--hero-accent)"
                />
              </label>

              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3.5">
                <label className="group relative block">
                  <span className="block text-[12px] font-medium tracking-wide text-white/80">
                    Preferred Date (optional)
                  </span>
                  <div className="relative mt-0.5">
                    <input
                      type="date"
                      name="preferredDate"
                      value={values.preferredDate}
                      onChange={handleChange}
                      className="scheme-dark block w-full cursor-pointer border-0 border-b border-white/30 bg-transparent py-1.5 text-[15px] text-white outline-none transition-colors duration-200 focus:border-(--hero-accent)"
                    />
                  </div>
                </label>
                <UnderlineSelect
                  label="Time Zone"
                  name="timeZone"
                  value={values.timeZone}
                  onChange={handleChange}
                  options={TIME_ZONES}
                  required
                />
              </div>

              <UnderlineSelect
                label="Preferred Time Slot (optional)"
                name="timeSlot"
                value={values.timeSlot}
                onChange={handleChange}
                options={TIME_SLOTS}
                required={false}
              />

              <div className="flex justify-end pt-1">
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
      </div>
    </div>
  );
}
