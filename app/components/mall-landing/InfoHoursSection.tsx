"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, MapPin, Info, ArrowUpRight } from "lucide-react";

import { GoogleMapEmbed } from "./GoogleMapEmbed";
import { IMG, MALL_LOCATION } from "./constants";
import { SocialRow } from "./SocialRow";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function InfoHoursSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;

      gsap.utils.toArray<HTMLElement>("[data-amenity-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { y: "-10%" },
          {
            y: "10%",
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
  };

  return (
    <section 
      ref={sectionRef}
      // Removed max-w-7xl to allow full viewport width
      className="w-full pt-24 pb-20 md:pt-32 bg-background transition-colors duration-700 "
    >
      <div className="w-full px-4 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          
          {/* --- Location Card --- */}
          <motion.div 
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="relative col-span-1 min-h-[45rem] border-[6px] border-[var(--neo-border)] bg-card shadow-[24px_24px_0px_0px_var(--neo-shadow)] md:col-span-8"
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image 
                data-amenity-img
                src={IMG.cityNight} 
                alt="Mall Location" 
                fill 
                className="object-cover grayscale contrast-125 opacity-40 transition-all duration-700 will-change-transform" 
                sizes="100vw" 
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-16">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 border-4 border-[var(--neo-border)] bg-[var(--neo-accent-3)] px-6 py-2 text-sm font-black text-black uppercase tracking-widest shadow-[6px_6px_0px_0px_var(--neo-shadow)] -rotate-1">
                  <MapPin size={20} strokeWidth={3} /> Location
                </div>
                
                <h3 className="text-foreground text-[clamp(4rem,12vw,10rem)] font-black leading-[0.8] tracking-tighter uppercase drop-shadow-[4px_4px_0px_var(--background)]">
                  Find us <br /> in <span className="text-[var(--neo-accent-1)]">Kinshasa.</span>
                </h3>
              </div>

              <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between border-t-[6px] border-[var(--neo-border)] pt-12">
                <div className="space-y-2 text-foreground">
                  <p className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">123 Avenue du Commerce</p>
                  <p className="text-foreground-secondary text-xl font-bold uppercase tracking-[0.4em]">Gombe, DRC</p>
                </div>
                <SocialRow className="flex gap-8 scale-150 origin-bottom-right" />
              </div>
            </div>
          </motion.div>

          {/* --- Hours & Map Column --- */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-10">
            
            {/* Hours Card */}
            <motion.div 
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="flex-1 border-[6px] border-[var(--neo-border)] bg-card p-10 shadow-[24px_24px_0px_0px_var(--neo-accent-2)]"
            >
              <div className="flex items-center justify-between mb-12 border-b-[6px] border-[var(--neo-border)] pb-8">
                <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4 italic text-foreground">
                  <Clock className="w-10 h-10" strokeWidth={4} /> Hours
                </h3>
                <span className="border-4 border-[var(--neo-border)] bg-[var(--neo-accent-1)] px-4 py-2 text-sm font-black uppercase tracking-tighter text-black shadow-[6px_6px_0px_0px_var(--neo-shadow)] rotate-2">
                  Open Now
                </span>
              </div>

              <div className="space-y-8">
                {[
                  { day: "Monday – Sunday", hours: "08:00 – 23:00" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-foreground-secondary font-black uppercase text-xs tracking-[0.5em]">{item.day}</span>
                    <span className="text-5xl lg:text-6xl font-black tabular-nums tracking-tighter text-[var(--neo-accent-1)]">{item.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex gap-5 border-t-[6px] border-[var(--neo-border)] pt-10 text-base font-bold uppercase leading-tight italic text-foreground-secondary">
                <Info className="w-8 h-8 shrink-0 text-[var(--neo-accent-4)]" strokeWidth={4} />
                <p>Holiday hours may vary. Visit our info desk for updates.</p>
              </div>
            </motion.div>

            {/* Map Preview */}
            <motion.div 
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="group/map relative h-80 cursor-pointer border-[6px] border-[var(--neo-border)] bg-card shadow-[24px_24px_0px_0px_var(--neo-shadow)] overflow-hidden"
              onClick={() => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${MALL_LOCATION.lat},${MALL_LOCATION.lng}`;
                window.open(mapUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <div className="absolute inset-0 grayscale contrast-150 brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700">
                <GoogleMapEmbed
                  fill
                  title={MALL_LOCATION.title}
                  lat={MALL_LOCATION.lat}
                  lng={MALL_LOCATION.lng}
                />
              </div>
              
              <motion.button 
                type="button"
                whileHover={{ x: -8, y: -8 }}
                className="absolute bottom-8 right-8 z-20 flex items-center gap-4 border-4 border-[var(--neo-border)] bg-[var(--neo-accent-3)] px-8 py-4 text-base font-black uppercase tracking-tighter text-black shadow-[8px_8px_0px_0px_var(--neo-shadow)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Go <ArrowUpRight size={24} strokeWidth={4} />
              </motion.button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}