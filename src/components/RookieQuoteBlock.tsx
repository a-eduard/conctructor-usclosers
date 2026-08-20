"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RookieQuoteBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [step, setStep] = useState(0); 

  useEffect(() => {
    if (hasPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Trigger when block is mostly in view
        if (entry.isIntersecting && !hasPlayed && !isFrozen) {
          setIsFrozen(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasPlayed, isFrozen]);

  useEffect(() => {
    if (isFrozen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Step 1: Wait 1s, show main quote
      const t1 = setTimeout(() => setStep(1), 1000);
      
      // Step 2: Wait 2.5s, show subtext
      const t2 = setTimeout(() => setStep(2), 2500);

      // Step 3: Wait 4.5s, hide text
      const t3 = setTimeout(() => setStep(3), 4500);

      // Step 4: Wait 5.5s, unfreeze and remove overlay
      const t4 = setTimeout(() => {
        setIsFrozen(false);
        setHasPlayed(true);
        document.body.style.overflow = '';
      }, 5500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        document.body.style.overflow = '';
      };
    }
  }, [isFrozen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <section ref={containerRef} className="py-24 sm:py-32 md:py-48 bg-background-primary flex flex-col items-center justify-center relative transition-theme">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 relative z-10">
            <h2 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] sm:leading-[1.15] text-text-primary mb-6 sm:mb-8 transition-opacity duration-1000 ${hasPlayed ? 'opacity-100' : 'opacity-0'}`}>
              "I’ll just hire an ambitious sales rookie on commission."
            </h2>
            <p className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-500 italic drop-shadow-sm transition-opacity duration-1000 delay-500 ${hasPlayed ? 'opacity-100' : 'opacity-0'}`}>
              What could possibly go wrong?
            </p>
        </div>
      </section>

      {/* Fullscreen Overlay for the freeze effect */}
      <AnimatePresence>
        {isFrozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }} // Сделали исчезновение более плавным
            className="fixed inset-0 z-[100] bg-background-primary flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 touch-none"
          >
            <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center justify-center w-full">
              <AnimatePresence>
                {(step === 1 || step === 2) && (
                  <motion.blockquote 
                    initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] sm:leading-[1.15] text-text-primary px-2 text-center max-w-5xl mb-6 sm:mb-8"
                  >
                    "I’ll just hire an ambitious sales rookie on commission."
                  </motion.blockquote>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {step === 2 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.85, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.85, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-500 italic drop-shadow-sm px-2 text-center"
                  >
                    What could possibly go wrong?
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}