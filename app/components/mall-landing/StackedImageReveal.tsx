"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StackedImageReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);

  panelRefs.current = [];
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !panelRefs.current.includes(el)) {
      panelRefs.current.push(el);
    }
  };

  useGSAP(() => {
    if (!triggerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "+=400%", 
        scrub: 1, 
        pin: true,
        anticipatePin: 1,
      },
    });

    const totalPanels = panelRefs.current.length;

    panelRefs.current.forEach((panel, i) => {
      const isLast = i === totalPanels - 1;

      if (!isLast) {
        // Cards 1-3: Shrink to center
        tl.to(panel, {
          scale: 0,
          rotate: 15,
          duration: 1,
          ease: "expo.inOut",
          transformOrigin: "center center",
        }, i);
      } else {
        // Final Card: Zoom out (from large to normal)
        // This starts halfway through the previous card's exit for a smooth blend
        tl.fromTo(panel, 
          { scale: 2.5, rotate: -10 }, // Start huge and tilted
          { 
            scale: 1, 
            rotate: 0, 
            duration: 1.5, 
            ease: "power4.out" 
          }, 
          i - 0.5 // Overlap with the penultimate card's shrink
        );
      }
    });

  }, { scope: containerRef });

  const CONTENT = [
    {
      src: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop",
      label: "DATA_01 // THE_HARVEST",
      title: "Hand Picked",
      desc: "Hand-picked organic excellence sourced daily from local farmers.",
      color: "bg-[#B2FF05]"
    },
    {
      src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2026&auto=format&fit=crop",
      label: "DATA_02 // THE_OVEN",
      title: "Artisan Gold",
      desc: "Boulangerie traditions meet modern heat. Baked every hour.",
      color: "bg-[#FFD300]"
    },
    {
      src: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop",
      label: "DATA_03 // THE_PANTRY",
      title: "Global Elite",
      desc: "Curated luxury ingredients from every corner of the globe.",
      color: "bg-[#00E5FF]"
    },
    {
      src: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2074&auto=format&fit=crop",
      label: "DATA_04 // DESTINATION",
      title: "La Prima",
      desc: "The pinnacle of retail experience in the heart of the Mall.",
      color: "bg-[#FF3E3E]"
    }
  ];

  return (
    <div ref={containerRef} className="bg-black">
      <div ref={triggerRef} className="relative h-screen w-full overflow-hidden">
        {CONTENT.map((item, i) => (
          <div 
            key={i}
            ref={addToRefs}
            className="absolute inset-0 w-full h-full border-black will-change-transform flex flex-col justify-center items-center"
            style={{ 
              zIndex: CONTENT.length - i,
            }}
          >
            <div className="relative w-full h-full overflow-hidden border-b-[8px] border-black">
              <Image 
                src={item.src} 
                alt={item.title} 
                fill 
                className="object-cover  contrast-125 brightness-50" 
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
            </div>

            <div className="text-content-wrapper absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <div className="max-w-5xl space-y-6">
                <span className={cn(
                    "inline-block px-4 py-1 text-black text-xs md:text-sm font-black tracking-widest uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    item.color
                )}>
                  {item.label}
                </span>
                
                <h2 className="text-white text-7xl md:text-[10rem] lg:text-[13rem] font-black uppercase tracking-[-0.08em] leading-[0.75] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                  {item.title}
                </h2>
                
                <div className={cn(
                  "p-6 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] inline-block max-w-xl rotate-1",
                  item.color
                )}>
                  <p className="text-black text-sm md:text-lg font-bold uppercase leading-tight italic">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}