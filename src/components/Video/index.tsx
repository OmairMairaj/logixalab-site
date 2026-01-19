"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const platformSteps = [
  {
    id: 1,
    title: "Step-by-Step Customization",
    description: "Choose your fabric, silhouette, neckline, sleeves, and more with our guided, visual customizer. See live previews as you design.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Live Visual Preview",
    description: "Watch your design come to life in real-time. Every choice instantly updates the 2D preview, so you know exactly how it will look.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Publish & Share",
    description: "Share your unique designs in our public gallery. Get discovered by other creators and build your profile in the community.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=400&fit=crop",
  },
];

export default function Video() {
  return (
    <>
      <section className="relative z-10 py-16 md:py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              title="See JUTE Fashion in Action"
              paragraph="Experience our guided, mobile-first customization platform. Design your perfect Kurta Shalwar step-by-step with live visual updates, then share your creations with the community."
              center
              mb="80px"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {platformSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-one dark:bg-gray-dark dark:shadow-three"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-primary/20 p-3 backdrop-blur-sm">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-black dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="mb-6 text-lg text-body-color dark:text-body-color-dark">
              Ready to start designing? Join our creator community today.
            </p>
            <a
              href="#contact"
              className="inline-block rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary/90"
              style={{ backgroundColor: '#FF6B35' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
            >
              Get Started
            </a>
          </motion.div>

          <div className="absolute right-0 bottom-0 left-0 z-[-1] h-full w-full bg-[url(/images/video/shape.svg)] bg-cover bg-center bg-no-repeat opacity-30">
          </div>
        </div>
      </section>
    </>
  );
};
