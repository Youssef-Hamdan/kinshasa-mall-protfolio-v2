"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView, animate, type AnimationPlaybackControls } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

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
    color: "bg-[#FF3E3E]", // Harsh Red
  },
  {
    value: 5000,
    unit: "m2",
    label: "Leasing Area",
    description: "Premium spaces tailored for world-class retail brands.",
    className: "col-span-12 md:col-span-7 md:-mt-12 lg:col-start-3 lg:col-span-5 relative z-20",
    color: "bg-[#FFD300]", // Cyber Yellow
  },
  {
    value: 400,
    unit: "",
    label: "Indoor Parking",
    description: "Secure and convenient access for all our guests.",
    className: "col-span-12 md:col-span-5 lg:col-start-9 lg:col-span-3 mt-12 md:mt-24 relative z-20",
    color: "bg-[#00E5FF]", // Cyan
  },
  {
    value: 1000,
    unit: "m2",
    label: "Supermarket Area",
    description: "A vast destination for daily essentials and luxury goods.",
    className: "col-span-12 md:col-span-10 lg:col-start-5 lg:col-span-6 mt-16 md:mt-32 relative z-20",
    color: "bg-[#B2FF05]", // Acid Green
  },
];

function Counter({ value, unit }: { value: number; unit: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (!inView) {
      setDisplayValue(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {unit && <span className="text-[0.4em] ml-2 font-black uppercase italic">{unit}</span>}
    </span>
  );
}

export function MallStatsSection() {
  const container = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!img1Ref.current || !img2Ref.current) return;
    gsap.to(img1Ref.current, { y: -80, ease: "none", scrollTrigger: { trigger: container.current, scrub: true } });
    gsap.to(img2Ref.current, { y: -120, ease: "none", scrollTrigger: { trigger: container.current, scrub: true } });
  }, { scope: container });

  return (
    <section ref={container} className="bg-background py-32 md:py-48 px-6 lg:px-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative">
        
        {/* --- IMAGE 1: Neo-Brutalist Frame --- */}
        <div className="absolute -right-4 top-0 w-[300px] h-[400px] border-4 border-border shadow-[12px_12px_0px_0px_var(--foreground)] overflow-hidden z-0 hidden md:block rotate-3">
          <div ref={img1Ref} className="relative w-full h-[120%]">
            <Image src="/images/hero-night.webp" alt="Mall" fill className="object-cover" />
          </div>
        </div>

        {/* --- IMAGE 2: Neo-Brutalist Frame --- */}
        <div className="absolute left-4 bottom-20 w-[240px] h-[320px] md:w-[350px] md:h-[480px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-[5] hidden lg:block -rotate-6">
          <div ref={img2Ref} className="relative w-full h-[120%]">
            <Image 
              src="/images/hero-night.webp" 
              alt="Mall Interior" 
              fill 
              className="object-cover"
              sizes="30vw"
            />
          </div>
          {/* Y2K/Brutalist Overlay - No soft gradients! */}
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-12 gap-y-24 md:gap-x-12 relative z-10">
          {STAT_DATA.map((stat, index) => (
            <div key={index} className={cn("flex flex-col group", stat.className)}>
              {/* Value with hard drop shadow text */}
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-none text-foreground drop-shadow-[4px_4px_0px_var(--foreground)]"
              >
                <Counter value={stat.value} unit={stat.unit} />
              </motion.h2>
              
              {/* Content Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "mt-6 p-6 border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] max-w-sm transition-transform group-hover:-translate-y-1",
                  stat.color
                )}
              >
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 italic">
                  {stat.label}
                </h3>
                <p className="text-foreground font-bold text-sm leading-tight">
                  {stat.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}