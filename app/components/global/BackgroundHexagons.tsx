"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hexagon } from "lucide-react";

const HEX_PATTERN = [
  { top: "5%", left: "10%", size: 120, rotate: 15, opacity: 0.03 },
  { top: "15%", left: "85%", size: 180, rotate: -10, opacity: 0.05 },
  { top: "40%", left: "50%", size: 300, rotate: 45, opacity: 0.02 },
  { top: "60%", left: "5%", size: 220, rotate: -20, opacity: 0.04 },
  { top: "85%", left: "75%", size: 140, rotate: 30, opacity: 0.03 },
  // Add as many as you like to fill a long page
  { top: "120%", left: "20%", size: 250, rotate: -15, opacity: 0.03 },
  { top: "150%", left: "80%", size: 100, rotate: 10, opacity: 0.05 },
];

export function BackgroundHexagons() {
  const { scrollYProgress } = useScroll();
  
  // This creates a parallax effect: background moves slower than foreground
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div style={{ y }} className="relative w-full h-[300%]">
        {HEX_PATTERN.map((hex, index) => (
          <div
            key={index}
            className="absolute text-neutral-500 dark:text-white"
            style={{
              top: hex.top,
              left: hex.left,
              width: `${hex.size}px`,
              height: `${hex.size}px`,
              transform: `rotate(${hex.rotate}deg)`,
              opacity: hex.opacity,
            }}
          >
            <Hexagon strokeWidth={0.5} className="w-full h-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}