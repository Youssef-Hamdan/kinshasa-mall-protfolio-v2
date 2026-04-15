"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register GSAP Plugin outside the component
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STAT_DATA = [
  {
    value: 10000,
    unit: "m2",
    label: "Total Mall Area",
    description: "A sprawling architectural masterpiece in the heart of the city.",
    className: "col-span-12 md:col-span-6 lg:col-span-5 relative z-20",
  },
  {
    value: 60,
    unit: "%",
    label: "Green Spaces",
    description: "Carefully curated gardens for tranquility & wellness.",
    className: "col-span-12 md:col-span-5 md:mt-32 lg:col-start-8 lg:col-span-4 relative z-20",
  },
  {
    value: 5000,
    unit: "m2",
    label: "Leasing Area",
    description: "Premium spaces tailored for world-class retail brands.",
    className: "col-span-12 md:col-span-7 md:-mt-12 lg:col-start-3 lg:col-span-5 relative z-20",
  },
  {
    value: 400,
    unit: "",
    label: "Indoor Parking",
    description: "Secure and convenient access for all our distinguished guests.",
    className: "col-span-12 md:col-span-5 lg:col-start-9 lg:col-span-3 mt-12 md:mt-24 relative z-20",
  },
  {
    value: 1000,
    unit: "m2",
    label: "Supermarket Area",
    description: "A vast destination for daily essentials and luxury goods.",
    className: "col-span-12 md:col-span-10 lg:col-start-5 lg:col-span-6 mt-16 md:mt-32 text-center md:text-left relative z-20",
  },
];

/** * Separate Counter Component to handle the numeric animation
 */
function Counter({ value, unit }: { value: number; unit: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 2.5,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });
        return () => controls.stop();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {unit && (
        <span className="text-[0.3em] ml-2 font-light italic opacity-70 align-baseline uppercase tracking-widest">
          {unit}
        </span>
      )}
    </span>
  );
}

export function MallStatsSection() {
  const container = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Small check to ensure refs are ready
      if (!img1Ref.current || !img2Ref.current) return;

      gsap.to(img1Ref.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(img2Ref.current, {
        y: -200,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <section 
      ref={container} 
      className="bg-background text-foreground py-32 md:py-64 px-6 lg:px-12 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* --- IMAGE 1: Top Right --- */}
        <div className="absolute -right-10 top-0 w-[280px] h-[400px] md:w-[400px] md:h-[550px] opacity-30 grayscale overflow-hidden rounded-2xl z-0 pointer-events-none hidden md:block">
          <div ref={img1Ref} className="relative w-full h-[130%] -top-20">
            <Image 
              src="/images/hero-night.webp"
              alt="Mall Exterior" 
              fill 
              className="object-cover"
              sizes="40vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        {/* --- IMAGE 2: Bottom Left --- */}
        <div className="absolute -left-20 bottom-10 w-[220px] h-[320px] md:w-[350px] md:h-[480px] opacity-25 grayscale overflow-hidden rounded-2xl z-0 pointer-events-none hidden lg:block">
          <div ref={img2Ref} className="relative w-full h-[140%] -top-20">
            <Image 
              src="/images/hero-night.webp" 
              alt="Mall Interior" 
              fill 
              className="object-cover"
              sizes="30vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="grid grid-cols-12 gap-y-24 md:gap-x-12 relative z-10">
          {STAT_DATA.map((stat, index) => (
            <div key={index} className={cn("flex flex-col group", stat.className)}>
              <div className="overflow-hidden">
                <motion.h2 
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: index * 0.1, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  viewport={{ once: true }}
                  className="text-7xl md:text-8xl lg:text-[10rem] font-serif tracking-tighter leading-[0.85] text-foreground"
                >
                  <Counter value={stat.value} unit={stat.unit} />
                </motion.h2>
              </div>
              
              <div className="overflow-hidden mt-6">
                <motion.div 
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 1, 
                    delay: (index * 0.1) + 0.4, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true }}
                  className="max-w-[320px] space-y-3 pl-4 border-l border-white/20 group-hover:border-white transition-colors duration-500"
                >
                  <h3 className="text-lg md:text-xl font-medium tracking-tight uppercase text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-foreground-secondary text-sm leading-snug font-light">
                    {stat.description}
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}