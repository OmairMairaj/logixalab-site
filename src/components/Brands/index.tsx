"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const css = `
.candy-bg {
  background-color: hsl(0 0% 96%, 2%);
  background-image: linear-gradient(
    135deg,
    hsl(0 0% 96%) 25%,
    transparent 25.5%,
    transparent 50%,
    hsl(0 0% 96%) 50.5%,
    hsl(0 0% 96%) 75%,
    transparent 75.5%,
    transparent
  );
  background-size: 10px 10px;
}

/* White stripe overlay for bars (transparent so orange stays orange) */
.candy-stripes {
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.45) 0px,
    rgba(255, 255, 255, 0.45) 6px,
    rgba(255, 255, 255, 0.0) 6px,
    rgba(255, 255, 255, 0.0) 12px
  );
  background-size: 16px 16px;
}`;

interface BarChartData {
  value: number;
  label: string;
  className?: string;
  showToolTip?: boolean;
  delay: number;
}

const statsData: BarChartData[] = [
  { value: 35, label: "Traditional Tailors", delay: 0.2, className: "bg-gray-500" },
  { value: 25, label: "Ready-Made Brands", delay: 0.4, className: "bg-gray-500" },
  {
    value: 95,
    label: "JUTE Fashion",
    className: "bg-primary",
    showToolTip: true,
    delay: 0.6,
  },
  { value: 40, label: "Other Platforms", delay: 0.8, className: "bg-gray-500" },
];

const BarChart = ({
  value,
  label,
  showToolTip = false,
  delay = 0,
}: BarChartData) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: "spring", damping: 18, delay }}
      className="w-full"
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
          {label}
        </p>
        {showToolTip && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            User Satisfaction
          </span>
        )}
      </div>
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-gray-800/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, type: "spring", damping: 20, delay }}
          className="h-full rounded-full"
          style={{ backgroundColor: "#FF6B35" }}
        />
        {/* White stripe design overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay">
          <div className="candy-stripes h-full w-full" />
        </div>
      </div>
      <div className="mt-1 text-right text-sm font-semibold text-black dark:text-white">
        <NumberFlow value={value} suffix="%" />
      </div>
    </motion.div>
  );
};

const Brands = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="stats-section" className="pt-16">
      <style>{css}</style>
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
                We Deliver Results
              </h2>
              <p className="text-base text-body-color dark:text-body-color-dark md:text-lg">
                See how JUTE Fashion compares to traditional tailoring and other platforms in user satisfaction.
              </p>
            </div>
            <div className="mx-auto flex max-w-4xl flex-col gap-5">
              {statsData.map((stat) => (
                <BarChart key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
