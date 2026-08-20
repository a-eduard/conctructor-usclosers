"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/o19.png',
  '/images/o6.png',
  '/images/o3.png',
  '/images/o7.png',
  '/images/o17.png',
  '/images/o10.png',
  '/images/o8.png',
  '/images/o16.png'
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const delay = currentIndex === 0 ? 3000 : 2000;
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="relative w-full aspect-square sm:aspect-[4/3] max-w-2xl mx-auto transform transition-transform duration-700 hover:-translate-y-2">
      <div className="relative w-full h-full overflow-hidden sm:overflow-visible">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`SalesOps Module ${currentIndex + 1}`}
              fill
              quality={65} // Сильная оптимизация веса PNG
              priority={currentIndex === 0} // Первая картинка грузится без задержек
              sizes="(max-width: 768px) 100vw, 50vw" // Адаптивная загрузка
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {currentIndex === 0 && (
            <motion.div
              key="badge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-[90%] sm:w-auto flex justify-center"
            >
              <div className="px-5 py-3 md:px-10 md:py-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                <span className="text-[10px] md:text-sm font-semibold text-white/95 tracking-[0.15em] md:tracking-[0.25em] uppercase whitespace-nowrap">
                  The Future of Sales Teams
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}