"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { UtensilsCrossed, Store, Dumbbell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMG } from "./constants";

const CARD_COUNT = 4;

/** * Mapping cards to your specific Kinshasa Mall accent variables 
 */
const STAT_CARDS = [
  {
    label: "Restaurants",
    value: 10,
    suffix: "+",
    icon: UtensilsCrossed,
    imageSrc: IMG.gallery2,
    imageAlt: "Dining at Kinshasa Mall",
    blurb: "Discover a world of flavors. From quick, casual bites on the go to elegant sit-down meals, our diverse selection of restaurants caters to every craving.",
    examples: ["Smokin", "Nice Cream", "Rest Post", "Meat Way"],
    // Neo-Brutalist Palette Mapping
    accentColor: "var(--neo-accent-1)", // Acid Green
    rotation: "-rotate-2",
  },
  {
    label: "Shops",
    value: 40,
    suffix: "+",
    icon: Store,
    imageSrc: IMG.shopping,
    imageAlt: "Shopping at Kinshasa Mall",
    blurb: "Explore an expansive mix of retail brands. Whether you're looking for fashion, tech, or daily essentials, our diverse directory brings everything together.",
    examples: ["CFC", "Al Jawad", "Meat Way", "Rest Post"],
    accentColor: "var(--neo-accent-2)", // Cyber Yellow
    rotation: "rotate-2",
  },
  {
    label: "Sports center",
    value: 3,
    suffix: "",
    icon: Dumbbell,
    imageSrc: IMG.building,
    imageAlt: "Sports and fitness at Kinshasa Mall",
    blurb: "Keep your fitness goals on track. Featuring an expansive main arena, dedicated fitness studios, and indoor courts to train, play, and stay active.",
    examples: ["Main arena", "Fitness studio", "Indoor courts"],
    accentColor: "var(--neo-accent-3)", // Cyan
    rotation: "-rotate-1",
  },
  {
    label: "Entertainment",
    value: 2,
    suffix: "",
    icon: Sparkles,
    imageSrc: IMG.gallery3,
    imageAlt: "Entertainment at Kinshasa Mall",
    blurb: "A world of fun for all ages. With a modern cinema complex and dynamic family arcades, our entertainment wing is the ultimate destination to unwind.",
    examples: ["Cinema complex", "Family arcade"],
    accentColor: "var(--neo-accent-4)", // Red/Pink
    rotation: "rotate-2",
  },
];

function useCountUp(target: number, durationMs: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / durationMs, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setN(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, active]);
  return n;
}

function StatCardBody({ row }: { row: (typeof STAT_CARDS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  const n = useCountUp(row.value, 800, inView);
  const Icon = row.icon;

  return (
    <div ref={ref} className="flex h-full flex-col justify-between bg-card p-6 md:p-10 transition-colors duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b-[6px] border-[var(--neo-border)] pb-6">
          <div 
            className="border-4 border-[var(--neo-border)] p-3 shadow-[4px_4px_0px_0px_var(--neo-shadow)] transition-all"
            style={{ backgroundColor: row.accentColor }}
          >
            <Icon className="size-8 text-black" strokeWidth={3} />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-foreground">{row.label}</span>
        </div>
        
        <h2 className="mt-4 text-7xl font-black tracking-tighter text-foreground md:text-8xl lg:text-9xl leading-none">
          {n}<span className="text-5xl md:text-6xl text-[var(--neo-accent-1)]">{row.suffix}</span>
        </h2>
        
        <p className="text-foreground font-bold text-base leading-tight md:text-lg border-l-[6px] border-[var(--neo-border)] pl-6 mt-4 italic">
          {row.blurb}
        </p>
      </div>

      <div className="mt-10 border-t-[6px] border-[var(--neo-border)] pt-8">
        <p className="text-foreground-secondary text-xs font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
          <span className="size-2 bg-[var(--neo-accent-1)] animate-pulse" /> Available Now
        </p>
        <ul className="flex flex-wrap gap-4">
          {row.examples.map((name) => (
            <li
              key={name}
              style={{ boxShadow: `4px 4px 0px 0px var(--neo-shadow)` }}
              className="border-4 border-[var(--neo-border)] bg-background px-4 py-2 text-xs font-black uppercase transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_var(--neo-shadow)] md:text-sm text-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StackCard({
  i,
  progress,
  imageSrc,
  imageAlt,
  children,
  className,
  imageLeft,
  accentColor,
}: StackCardProps & { accentColor: string }) {
  const targetScale = 1 - (CARD_COUNT - i) * 0.04;
  const range: [number, number] = [i * 0.25, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center px-4">
      <motion.div
        style={{ scale, top: `calc(-2vh + ${i * 35}px)` }}
        className={cn(
          "relative flex h-[min(750px,80svh)] w-full max-w-[72rem] origin-top flex-col overflow-hidden",
          "border-[6px] border-[var(--neo-border)] bg-background shadow-[24px_24px_0px_0px_var(--neo-shadow)]",
          className,
        )}
      >
        <div className={cn("flex min-h-0 flex-1 flex-col lg:flex-row", imageLeft && "lg:flex-row-reverse")}>
          <div className="flex min-h-0 flex-col overflow-y-auto lg:w-[45%] lg:shrink-0">
            {children}
          </div>

          {imageSrc && (
            <div className={cn(
                "relative min-h-[250px] flex-1 overflow-hidden lg:min-h-0",
                imageLeft ? "border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-[var(--neo-border)]" : "border-t-[6px] lg:border-t-0 lg:border-l-[6px] border-[var(--neo-border)]"
            )}>
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                fill
                className="object-cover transition-all duration-700"
                sizes="50vw"
              />
              <div 
                className="absolute top-6 right-6 px-4 py-2 font-black text-black text-sm uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: accentColor }}
              >
                Category_{i + 1}
              </div>
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
    <section ref={container} className="relative scroll-mt-24 bg-background pb-32 transition-colors duration-700">
      <div className="mx-auto flex flex-col items-center justify-center px-4">
        <div className="relative w-full lg:w-[90%] xl:w-[85%]">
          {STAT_CARDS.map((row, idx) => (
            <StackCard
              key={row.label}
              i={idx}
              progress={scrollYProgress}
              imageSrc={row.imageSrc}
              imageAlt={row.imageAlt}
              imageLeft={idx % 2 === 0}
              accentColor={row.accentColor}
              className={row.rotation}
            >
              <StatCardBody row={row} />
            </StackCard>
          ))}
        </div>
      </div>
    </section>
  );
}

interface StackCardProps {
  i: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  imageLeft?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}