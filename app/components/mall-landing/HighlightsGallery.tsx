"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
} from "@/components/uilayouts/progressive-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TextAnimation } from "@/components/ui/text-animation";
import { cn } from "@/lib/utils";
import { IMG } from "./constants";
import {
  SectionHeading,
  sectionHeaderContainerClass,
  sectionTitleAccentWordClass,
  sectionTitleLeadWordClass,
} from "./section-heading";

const HIGHLIGHT_ITEMS = [
  {
    img: IMG.gallery1,
    title: "Dining & cafés",
    desc: "From quick bites to sit-down meals, find flavors that fit every craving in one destination.",
    sliderName: "cfc",
  },
  {
    img: IMG.gallery2,
    title: "Smokehouse & grill",
    desc: "Bold grills and smoky aromas — a go-to spot when you want something hearty and satisfying.",
    sliderName: "smokin",
  },
  {
    img: IMG.gallery3,
    title: "Sweet treats",
    desc: "Cool off with ice cream and desserts perfect for families and a sunny day at the mall.",
    sliderName: "nice-cream",
  },
  {
    img: IMG.building,
    title: "Shopping & strolls",
    desc: "Browse stores, meet friends, and enjoy a bright, welcoming place to spend the day.",
    sliderName: "mall",
  },
] as const;

/** Base height before scroll expansion (matches previous fixed card). */
const HIGHLIGHT_CARD_HEIGHT_PX = 500;

/**
 * Total scroll span for this block (taller = more pixels of scroll).
 * Progress phases (scrollYProgress 0→1 through this section):
 * - [0, EXPAND_END): grow compact → fullscreen
 * - [EXPAND_END, HOLD_END): stay fullscreen
 * - [HOLD_END, 1]: shrink back to compact (leaving the section)
 */
const SCROLL_TRACK_MIN_HEIGHT = "360vh";

/** When `scrollYProgress` reaches this, expansion is complete (t = 1). */
const EXPAND_END = 0.36;

/** After this, the card shrinks toward compact as you scroll out (bottom exit). */
const HOLD_END = 0.58;

const cardShellClassName =
  "border-border bg-[#fcfcee] text-card-foreground shadow-xl dark:bg-card relative mx-auto overflow-hidden border dark:shadow-none";

export function HighlightsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const t = useTransform(scrollYProgress, (v) => {
    if (reduceMotion === true) return 0;
    const vv = Math.min(1, Math.max(0, v));
    if (vv <= EXPAND_END) {
      return EXPAND_END > 0 ? vv / EXPAND_END : 0;
    }
    if (vv <= HOLD_END) {
      return 1;
    }
    const shrinkSpan = 1 - HOLD_END;
    if (shrinkSpan <= 0) return 0;
    return 1 - (vv - HOLD_END) / shrinkSpan;
  });

  const heightPx = useTransform(t, (p) => {
    if (typeof window === "undefined") return HIGHLIGHT_CARD_HEIGHT_PX;
    const vh = window.innerHeight;
    return HIGHLIGHT_CARD_HEIGHT_PX + p * (vh - HIGHLIGHT_CARD_HEIGHT_PX);
  });

  const widthPx = useTransform(t, (p) => {
    if (typeof window === "undefined") return 1200;
    const vw = window.innerWidth;
    const sidePad = 16;
    const wCompact = Math.min(100 * 16, vw - 2 * sidePad);
    return wCompact + p * (vw - wCompact);
  });

  const borderRadiusPx = useTransform(t, (p) => 24 * (1 - p));

  return (
    <section id="highlights" className="scroll-mt-24 overflow-x-clip pb-10 sm:pb-24 md:scroll-mt-28">
      <div className={cn(sectionHeaderContainerClass, "pt-16")}>
        <SectionHeading
          title={
            <>
              <span className={sectionTitleLeadWordClass}>Check</span>{" "}
              <br className="hidden lg:block" />
              <span className={cn(sectionTitleAccentWordClass, "font-light italic")}>Highlights</span>
            </>
          }
        />
      </div>

      <div
        ref={scrollRef}
        className="relative w-full"
        style={{ minHeight: reduceMotion === true ? undefined : SCROLL_TRACK_MIN_HEIGHT }}
      >
        <div className="sticky top-0 flex h-[100dvh] min-h-[500px] w-full items-center justify-center px-0">
          {hasMounted ? (
            <motion.div
              className={cardShellClassName}
              style={{
                height: heightPx,
                width: widthPx,
                borderRadius: borderRadiusPx,
                maxWidth: "100%",
              }}
            >
              <HighlightsCarouselInner />
            </motion.div>
          ) : (
            <div
              className={`${cardShellClassName} h-[500px] w-full max-w-[100rem] rounded-2xl md:rounded-3xl`}
            >
              <HighlightsCarouselInner />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Inner carousel only — used inside motion wrapper with inherited border-radius. */
function HighlightsCarouselInner() {
  const isSmUp = useMediaQuery("(min-width: 640px)");

  return (
    <ProgressSlider
      vertical={isSmUp}
      fastDuration={300}
      duration={4000}
      activeSlider={HIGHLIGHT_ITEMS[0].sliderName}
      className="flex h-full min-h-0 flex-col-reverse sm:flex-row"
    >
      <SliderBtnGroup className="border-border/50 z-10 grid h-fit w-full grid-cols-2 overflow-hidden border-t sm:flex sm:h-full sm:w-96 sm:shrink-0 sm:flex-col sm:border-t-0 sm:border-r sm:bg-white/55 dark:sm:bg-muted/40">
        {HIGHLIGHT_ITEMS.map((item) => (
          <SliderBtn
            key={item.sliderName}
            value={item.sliderName}
            className="border-border/50 hover:bg-primary/5 border p-3 pb-6 text-left transition-colors sm:flex-1 sm:border-b sm:pb-0 sm:pl-5 sm:pt-0"
            progressBarClass="bg-primary bottom-0 left-0 h-4 before:h-full before:w-4 sm:top-0 sm:h-full sm:w-3"
          >
            <TextAnimation
              as="h3"
              text={item.title}
              letterAnime
              className="bg-primary text-primary-foreground mb-2 w-fit rounded-md px-3 py-1 text-sm font-semibold"
            />
            <p className="text-muted-foreground line-clamp-2 text-sm font-medium">
              {item.desc}
            </p>
          </SliderBtn>
        ))}
      </SliderBtnGroup>
      <SliderContent className="relative min-h-0 w-full flex-1 sm:h-full sm:min-w-0">
        {HIGHLIGHT_ITEMS.map((item) => (
          <SliderWrapper key={item.sliderName} value={item.sliderName} className="absolute inset-0 h-full sm:relative sm:inset-auto">
            <div className="relative h-full w-full">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, calc(100vw - 24rem)"
                priority={item.sliderName === HIGHLIGHT_ITEMS[0].sliderName}
              />
            </div>
          </SliderWrapper>
        ))}
      </SliderContent>
    </ProgressSlider>
  );
}
