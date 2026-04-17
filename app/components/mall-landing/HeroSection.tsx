"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "../premium-header/language-provider";
import { IMG } from "./constants";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const container = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();

  // Brutalist parallax: Image moves slower while text elements might rotate slightly
  const heroFade = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  const heroSrc = IMG.heroDay;

  useGSAP(
    () => {
      if (reduceMotion) return;

      const titleSplit = new SplitType("[data-hero='title-part']", {
        types: "chars",
      });

      if (titleSplit.chars) {
        gsap.set(titleSplit.chars, { yPercent: 100, rotate: 10 });

        gsap.to(titleSplit.chars, {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          stagger: 0.03,
          ease: "expo.out",
          delay: 0.2,
        });
      }

      // Parallax on the background image
      gsap.to("[data-hero='img']", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        titleSplit.revert();
      };
    },
    { scope: container, dependencies: [reduceMotion] }
  );

  return (
    <section
      id="home"
      ref={container}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-background"
    >
      {/* 1. Full Screen Background - Kept but with a Brutalist overlay */}
      <motion.div
        style={{ opacity: heroFade, scale: heroScale }}
        className="absolute inset-0 z-0"
      >
        <Image
          data-hero="img"
          src={heroSrc}
          alt=""
          fill
          priority
          className="object-cover brightness-[0.6] contrast-[1.1]"
        />
        {/* Harsh Scanline/Noise Overlay - Signature Brutalist texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      </motion.div>

      {/* 2. Brutalist Typography Layout */}
      <div className="relative z-10 flex flex-col mt-auto w-full p-4 md:p-10 gap-6">
        
        {/* Header Block 1: The "Plus qu'un Mall" as a stark sticker */}
        <div className="w-fit bg-foreground p-4 md:p-6 -rotate-1 border-[4px] border-border shadow-[8px_8px_0px_0px_var(--neo-shadow,var(--foreground))]">
          <h1
            data-hero="title-part"
            className="text-background text-[clamp(2.5rem,8vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.08em]"
          >
            Plus qu’un Mall
          </h1>
        </div>

        {/* Header Block 2: The "Une Expérience" as a clashing accent */}
        <div className="w-fit self-end bg-primary p-4 md:p-6 rotate-1 border-[4px] border-black shadow-[8px_8px_0px_0px_var(--neo-shadow,rgba(0,0,0,1))] mt-[-20px] mr-4 md:mr-12">
          <h2
            data-hero="title-part"
            className="text-foreground text-[clamp(2rem,6vw,7rem)] font-black uppercase italic leading-[0.8] tracking-[-0.08em]"
          >
            Une Expérience
          </h2>
        </div>

        {/* 3. Brutalist Action Bar */}
        <div className="flex flex-wrap items-end justify-between gap-6 mt-8">


          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            className="group flex items-center gap-4 bg-primary px-8 py-4 border-[3px] border-border shadow-[6px_6px_0px_0px_var(--foreground)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <span className="text-foreground font-black uppercase tracking-widest text-sm">
              Explore
            </span>
            <ChevronDown className="text-foreground h-6 w-6 group-hover:animate-bounce" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Border Accent */}
      {/* <div className="absolute bottom-0 left-0 w-full h-4 bg-primary border-t-4 border-black z-20" /> */}
    </section>
  );
}