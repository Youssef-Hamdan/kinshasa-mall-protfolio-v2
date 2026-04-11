"use client";

/**
 * Stacking cards scroll pattern (Olivier Larose–style scroll-linked scale).
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "motion/react";
import { Clock, UtensilsCrossed, Store, Dumbbell, Sparkles, MapPin, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleMapEmbed } from "./GoogleMapEmbed";
import { IMG, MALL_LOCATION } from "./constants";
import {
  SectionHeading,
  sectionTitleAccentWordClass,
  sectionTitleLeadWordClass,
} from "./section-heading";
import { BlurRevealTitle } from "@/components/ui/text-animation";

/** Opening hours + four “by the numbers” cards */
const CARD_COUNT = 5;

const STAT_CARDS: {
  label: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  blurb: string;
  /** Sample tenants open / represented (shown on the card) */
  examples: string[];
}[] = [
  {
    label: "Restaurants",
    value: 10,
    suffix: "+",
    icon: UtensilsCrossed,
    imageSrc: IMG.gallery2,
    imageAlt: "Dining at Kinshasa Mall",
    blurb: "Discover a world of flavors right here at Kinshasa Mall. From quick, casual bites on the go to elegant sit-down meals with friends and family, our diverse selection of restaurants, cafes, and food court options caters to every craving and occasion.",
    examples: ["Smokin", "Nice Cream", "Rest Post", "Meat Way"],
  },
  {
    label: "Shops",
    value: 40,
    suffix: "+",
    icon: Store,
    imageSrc: IMG.shopping,
    imageAlt: "Shopping at Kinshasa Mall",
    blurb: "Explore an expansive mix of local and international retail brands. Whether you're looking for the latest fashion trends, tech gadgets, daily essentials, or the perfect gift, our diverse directory of stores brings everything you need together under one roof.",
    examples: ["CFC", "Al Jawad", "Meat Way", "Rest Post", "Kinshasa Mall"],
  },
  {
    label: "Sports center",
    value: 3,
    suffix: "",
    icon: Dumbbell,
    imageSrc: IMG.building,
    imageAlt: "Sports and fitness at Kinshasa Mall",
    blurb: "Keep your fitness goals on track with our premium, fully-equipped sporting facilities. Featuring an expansive main arena, dedicated fitness studios, and indoor courts, it's the perfect environment to train, play, and stay active without ever leaving the mall.",
    examples: ["Main arena", "Fitness studio", "Indoor courts"],
  },
  {
    label: "Entertainment",
    value: 2,
    suffix: "",
    icon: Sparkles,
    imageSrc: IMG.gallery3,
    imageAlt: "Entertainment at Kinshasa Mall",
    blurb: "Step into a world of fun and excitement for all ages. With a modern cinema complex showing the latest blockbusters and dynamic family arcades filled with games, our entertainment wing is the ultimate destination to unwind and create lasting memories.",
    examples: ["Cinema complex", "Family arcade"],
  },
];

function useCountUp(target: number, durationMs: number, active: boolean) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    setN(0);
    let raf = 0;
    let cancelled = false;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min((now - t0) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      setN(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs, active]);

  return n;
}

function StatCardBody({ row }: { row: (typeof STAT_CARDS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  const n = useCountUp(row.value, 1200, inView);
  const Icon = row.icon;

  return (
    <div ref={ref} className="flex h-full flex-col justify-between p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="text-primary flex items-center gap-2">
          <Icon className="size-6 shrink-0 md:size-7" strokeWidth={1.5} aria-hidden />
          <span className="text-sm font-semibold tracking-wide uppercase">{row.label}</span>
        </div>
        <BlurRevealTitle
          as="h2"
          className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl"
        >
          {n}
          {row.suffix}
        </BlurRevealTitle>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">{row.blurb}</p>
      </div>

      <div className="border-border/50 mt-6 rounded-xl border bg-white/55 p-4 md:mt-auto md:p-5 dark:bg-muted/40">
        <p className="text-primary text-xs font-medium tracking-[0.2em] uppercase">Open now — spotlight</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Examples of ${row.label.toLowerCase()}`}>
          {row.examples.map((name) => (
            <li
              key={name}
              className="border-border/60 rounded-full border bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground md:text-sm dark:bg-background/70"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface StackCardProps {
  i: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  imageLeft?: boolean;
  priority?: boolean;
  /** No side image — content fills the card (e.g. hours + location only). */
  hideImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

function StackCard({
  i,
  progress,
  imageSrc,
  imageAlt,
  children,
  className,
  imageLeft,
  priority = false,
  hideImage = false,
}: StackCardProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const targetScale = 1 - (CARD_COUNT - i) * 0.05;
  const range: [number, number] = [i * 0.25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: stickyRef,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(cardScrollProgress, [0, 1], [2, 1]);

  return (
    <div
      ref={stickyRef}
      className="sticky top-0 flex h-screen w-full items-center justify-center px-3 sm:px-4"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={cn(
          "border-border bg-[#fcfcee] text-card-foreground shadow-xl dark:bg-card",
          "relative -top-[15%] flex h-[min(560px,85svh)] w-full max-w-[60rem] origin-top flex-col overflow-hidden rounded-2xl border",
          "md:rounded-3xl",
          className,
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            !hideImage && "lg:flex-row",
            !hideImage && imageLeft && "lg:flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex min-h-0 flex-col lg:overflow-y-auto",
              hideImage ? "w-full" : "lg:w-[min(44%,28rem)] lg:shrink-0",
            )}
          >
            {children}
          </div>

          {!hideImage && imageSrc && (
            <div className="relative min-h-[220px] flex-1 overflow-hidden sm:min-h-[280px] lg:min-h-0">
              <motion.div style={{ scale: imageScale }} className="absolute inset-0 h-full w-full">
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 96vw, 45vw"
                  priority={priority}
                />
              </motion.div>
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  "max-lg:bg-gradient-to-b max-lg:from-[#fcfcee] max-lg:via-[#fcfcee]/35 max-lg:to-transparent dark:max-lg:from-card dark:max-lg:via-card/35",
                  imageLeft
                    ? "lg:bg-gradient-to-l lg:from-[#fcfcee] lg:via-[#fcfcee]/25 lg:to-transparent dark:lg:from-card dark:lg:via-card/25"
                    : "lg:bg-gradient-to-r lg:from-[#fcfcee] lg:via-[#fcfcee]/25 lg:to-transparent dark:lg:from-card dark:lg:via-card/25",
                )}
                aria-hidden
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function MallInfoStackingCards() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="explore"
      ref={container}
      className="bg-background relative scroll-mt-24 text-foreground md:scroll-mt-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start px-4 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sticky Header Column */}
        <div className="relative top-0 z-10 flex w-full flex-col pt-20 pb-8 lg:sticky lg:h-screen lg:w-1/3 lg:justify-center lg:py-0 lg:pr-10 xl:w-[30%]">
          <SectionHeading
            title={
              <>
                <span className={sectionTitleLeadWordClass}>Explore</span>{" "}
                <br className="hidden lg:block" />
                <span className={cn(sectionTitleAccentWordClass, "font-light italic")}>the Mall</span>
              </>
            }
            subtitle="The Destination"
            lead="From premium retail to world-class dining and entertainment, uncover everything Kinshasa Mall has to offer under one roof."
          />
        </div>

        {/* Cards Column */}
        <div className="relative w-full lg:w-2/3 xl:w-[70%]">
          <StackCard i={0} progress={scrollYProgress} hideImage>
            <div className="flex h-full min-h-0 flex-col justify-between gap-6 p-6 md:p-8 lg:p-10">
              <div className="border-border/50 flex flex-col gap-3 rounded-xl border bg-white/55 p-4 md:p-5 dark:bg-muted/40">
                <div className="flex flex-col gap-1">
                  <div className="text-primary flex items-center gap-2">
                    <Clock className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    <p className="text-xs font-medium tracking-[0.2em] uppercase">Opening hours</p>
                  </div>
                  <p className="text-foreground mt-1 text-lg font-semibold md:text-xl">9:00 – 23:00</p>
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    We&apos;re open daily from 9:00 to 23:00. Holiday hours may vary — check with our info
                    desk for updates.
                  </p>
                </div>
              </div>

              <div className="border-border/50 mt-auto flex min-h-0 flex-1 flex-col gap-3 rounded-xl border bg-white/55 p-4 md:p-5 dark:bg-muted/40">
                <div className="flex flex-col gap-1">
                  <div className="text-primary flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    <p className="text-xs font-medium tracking-[0.2em] uppercase">Location</p>
                  </div>
                  <p className="text-foreground mt-1 text-lg font-semibold md:text-xl">
                    123 Avenue du Commerce
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Kinshasa, Democratic Republic of the Congo
                  </p>
                </div>
                <GoogleMapEmbed title={MALL_LOCATION.title} lat={MALL_LOCATION.lat} lng={MALL_LOCATION.lng} />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${MALL_LOCATION.lat},${MALL_LOCATION.lng}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/90 text-xs font-medium underline-offset-4 transition-colors hover:underline"
                >
                  Open location in Google Maps
                </a>
              </div>
            </div>
          </StackCard>

      {STAT_CARDS.map((row, idx) => {
        const i = idx + 1;
        const imageLeft = i % 2 === 0;
        return (
          <StackCard
            key={row.label}
            i={i}
            progress={scrollYProgress}
            imageSrc={row.imageSrc}
            imageAlt={row.imageAlt}
            imageLeft={imageLeft}
          >
            <StatCardBody row={row} />
          </StackCard>
        );
      })}
        </div>
      </div>
    </section>
  );
}
