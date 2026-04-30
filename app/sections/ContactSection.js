"use client";

import Image from "next/image";
import { useState } from "react";

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "service", label: "Service", type: "text", required: true },
  { name: "message", label: "Message (Optional)", type: "text", required: false },
];

function ContactField({ name, label, type, required, value, onChange }) {
  return (
    <label className="group relative block">
      <span className="block text-[13px] font-medium tracking-wide text-white/75">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="mt-1 block w-full border-0 border-b border-white/25 bg-transparent py-1.5 text-[15px] text-white outline-none transition-colors duration-200 focus:border-(--hero-accent)"
      />
    </label>
  );
}

export default function ContactSection() {
  const [values, setValues] = useState(() =>
    FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}),
  );

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
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 md:px-10"
    >
      {/* Form card */}
      <div className="relative w-full max-w-[480px] rounded-2xl border border-white/15 bg-black/45 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-10">
        <h2 className="font-heading text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-[2.25rem]">
          Let&apos;s Build
          <br />
          Together!
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5 md:gap-6"
        >
          {FIELDS.map((field) => (
            <ContactField
              key={field.name}
              {...field}
              value={values[field.name]}
              onChange={handleChange}
            />
          ))}

          <div className="mt-3 flex justify-center md:mt-4">
            <button
              type="submit"
              className="header-contact-btn"
              aria-label="Submit"
            >
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
    </section>
  );
}
