"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlurRevealTitle, TextAnimation } from "@/components/ui/text-animation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "../premium-header/language-provider";
import TrustMarquee from "./TrustMarquee";
import { IMG } from "./constants";

export function HeroSection() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";
  const heroSrc = IMG.heroDay;
  const heroImgClass = isLight
    ? "object-cover opacity-[0.42] saturate-[0.65]"
    : "object-cover opacity-40";

  const scrollPastHero = () => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: Math.min(window.innerHeight, maxScroll), behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="bg-hero-bg relative flex max-lg:overflow-x-clip min-h-[100svh] w-full scroll-mt-24 flex-col overflow-hidden md:scroll-mt-28"
    >
      <div className="absolute inset-0 z-0">
        <div className="hero-kenburns absolute inset-0 origin-center overflow-hidden">
          <Image
            key={heroSrc}
            src={heroSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className={heroImgClass}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden opacity-[0.06] mix-blend-overlay md:dark:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        {/* Dark only: tone gradient — light mode uses photo + vignette only */}
        <div className="absolute inset-0 z-[2] hidden bg-gradient-to-b from-hero-bg/50 via-hero-bg/20 to-hero-bg dark:block" />
        {/* Light only: strong white edge vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] dark:hidden"
          style={{
            background:
              "radial-gradient(ellipse 84% 76% at 50% 32%, transparent 10%, rgb(252 252 238 / 0.78) 52%, rgb(252 252 238 / 0.97) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 container mx-auto flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-8 text-center sm:px-6 sm:pt-24 md:pt-28">
        <div className="overflow-hidden">
          <BlurRevealTitle
            as="h1"
            className="text-foreground mx-auto mb-5 max-w-6xl px-1 text-[clamp(2.25rem,9vw,3.75rem)] leading-[0.92] font-medium tracking-tighter sm:mb-6 sm:px-0 sm:text-6xl sm:leading-[0.9] md:text-8xl lg:text-9xl"
          >
            {t.hero.titleLine1} <br />
            <span className="text-primary font-light italic">{t.hero.titleAccent}</span>
          </BlurRevealTitle>
        </div>

        <TextAnimation
          as="p"
          text={t.hero.description}
          letterAnime={false}
          className="text-muted-foreground mx-auto max-w-2xl px-1 text-sm leading-relaxed font-light sm:px-0 sm:text-base md:text-xl lg:text-2xl"
        />
      </div>

      <div className="relative z-10 mt-auto flex w-full flex-col items-center">
        <motion.div
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 1.1, duration: reduceMotion ? 0 : 0.8 }}
          className="flex flex-col items-center gap-2 pb-4"
        >
          <button
            type="button"
            onClick={scrollPastHero}
            className="text-primary hover:text-foreground group flex flex-col items-center gap-1 transition-colors"
            aria-label={t.hero.scrollHint}
          >
            <span className="text-[10px] font-medium tracking-[0.28em] uppercase">{t.hero.scrollHint}</span>
            <ChevronDown
              className="motion-safe:animate-bounce h-5 w-5 opacity-90 group-hover:opacity-100"
              strokeWidth={1.25}
              aria-hidden
            />
          </button>
        </motion.div>
        <TrustMarquee embedded />
      </div>
    </section>
  );
}
