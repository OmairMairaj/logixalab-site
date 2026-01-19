"use client";

import { motion } from "framer-motion";
import SectionTitle from "../Common/SectionTitle";

const Pricing = () => {
  const steps = [
    {
      number: "01",
      title: "Design Your Outfit",
      description: "Use our step-by-step customizer to design your perfect Kurta Shalwar. Choose fabrics, colors, patterns, and styles with live visual updates."
    },
    {
      number: "02",
      title: "Publish to Gallery",
      description: "Share your unique designs in our public gallery. Get discovered by other users and build your creator profile."
    },
    {
      number: "03",
      title: "Earn Rewards",
      description: "When others order your designs, you earn rewards. Turn your creativity into income while inspiring the community."
    }
  ];

  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            title="How It Works"
            paragraph="Design your Kurta Shalwar step-by-step with our guided customizer. Publish to the gallery, earn rewards, and join a community of creators."
            center
            width="665px"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative rounded-lg border border-body-color/10 bg-white p-8 shadow-one dark:border-body-color/10 dark:bg-gray-dark dark:shadow-three"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <motion.div 
                className="mb-6 flex items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </motion.div>
              </motion.div>
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF6B35" />
              <stop offset="1" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF6B35" />
              <stop offset="1" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
