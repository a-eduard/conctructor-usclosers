"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const o1 = '/images/old_rooms/1.png';
const o3 = '/images/old_rooms/3.png';
const o6 = '/images/old_rooms/6.png';
const o7 = '/images/old_rooms/7.png';
const o8 = '/images/old_rooms/8.png';
const o10 = '/images/old_rooms/10.png';
const o11 = '/images/old_rooms/11.png';
const o12 = '/images/old_rooms/12.png';
const o16 = '/images/old_rooms/16.png';
const o17 = '/images/old_rooms/17.png';

const CASES = [
  {
    before: 'Email Assistant',
    after: '12-Person Sales Dep',
    images: [o1, o3, o6, o7],
    days: 35
  },
  {
    before: 'Phone Caller',
    after: 'Enterprise Sales',
    images: [o8, o10, o11, o12],
    days: 14
  },
  {
    before: '$20 Upgrades',
    after: '$50,000 Licenses',
    images: [o16, o17, o11, o1],
    days: 45
  }
];

function ProgressCounter({ days }: { days: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    // Увеличили длительность счетчика, чтобы она совпадала с более плавным показом слайдов
    const duration = 4500; 

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setCount(Math.floor(easeInOut(progress) * days));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(days);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [days]);

  return <>{count}</>;
}

const HEXAGONS = [
  { id: 1, src: o1, row: 0, col: 0 },
  { id: 2, src: o6, row: 1, col: -1 },
  { id: 3, src: o3, row: 1, col: 1 },
  { id: 4, src: o7, row: 2, col: -2 },
  { id: 5, src: o17, row: 2, col: 0 },
  { id: 6, src: o10, row: 2, col: 2 },
  { id: 7, src: o8, row: 3, col: -1 },
  { id: 8, src: o16, row: 3, col: 1 },
];

export function HeroPyramid() {
  const [mounted, setMounted] = useState(false);
  const [activeHexId, setActiveHexId] = useState<number | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<typeof CASES[0] | null>(null);
  const [showBadges, setShowBadges] = useState(false);

  const timers = useRef({
    slideshow: null as NodeJS.Timeout | null,
    change: null as NodeJS.Timeout | null,
    removeBadges: null as NodeJS.Timeout | null,
  });

  const prevHexId = useRef<number | null>(null);

  const clearAllTimers = () => {
    if (timers.current.slideshow) clearTimeout(timers.current.slideshow);
    if (timers.current.change) clearInterval(timers.current.change);
    if (timers.current.removeBadges) clearTimeout(timers.current.removeBadges);
  };

  const runSlideshow = (forcedHexId?: number) => {
    clearAllTimers();

    let hexInfo;
    if (forcedHexId) {
      hexInfo = HEXAGONS.find(h => h.id === forcedHexId) || HEXAGONS[0];
    } else {
      do {
        hexInfo = HEXAGONS[Math.floor(Math.random() * HEXAGONS.length)];
      } while (hexInfo.id === prevHexId.current);
    }
    
    prevHexId.current = hexInfo.id;
    setActiveHexId(hexInfo.id);
    
    const selectedCase = CASES[Math.floor(Math.random() * CASES.length)];
    setActiveCase(selectedCase);
    setShowBadges(true);
    
    let count = 0;
    setActiveSrc(selectedCase.images[0]);
    
    // Плавный интервал смены: было 600ms, стало 1500ms
    timers.current.change = setInterval(() => {
      count++;
      if (count >= selectedCase.images.length) {
        if (timers.current.change) clearInterval(timers.current.change);
        setActiveSrc(hexInfo.src);
        
        timers.current.removeBadges = setTimeout(() => {
          setShowBadges(false);
          setActiveHexId(null);
          setActiveCase(null);
          timers.current.slideshow = setTimeout(() => runSlideshow(), 1000);
        }, 2000);
      } else {
        setActiveSrc(selectedCase.images[count]);
      }
    }, 1500);
  };

  useEffect(() => {
    setMounted(true);
    const initialTimeout = setTimeout(() => {
      runSlideshow();
    }, 500);

    return () => {
      clearTimeout(initialTimeout);
      clearAllTimers();
    };
  }, []);

  const handleHexClick = (id: number) => {
    if (activeHexId === id) return;
    runSlideshow(id);
  };

  const W = 130; 
  const DX = W * 0.53;
  const DY = W * 0.70;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center -mt-4 md:-mt-12 overflow-hidden md:overflow-visible">
      {/* Добавлена адаптивная трансформация (scale) для корректного отображения на мобильных */}
      <div className="relative w-full max-w-lg h-full flex justify-center mt-4 transform scale-[0.75] sm:scale-[0.85] md:scale-100 origin-top md:origin-center">
        {HEXAGONS.map((hex, index) => {
          const x = hex.col * DX;
          const y = hex.row * DY;
          
          const isSlideshowActive = activeHexId === hex.id;
          const displaySrc = isSlideshowActive && activeSrc ? activeSrc : hex.src;
          
          return (
            <motion.div
              key={hex.id}
              onClick={() => handleHexClick(hex.id)}
              initial={{ opacity: 0, x, y, filter: 'blur(16px)' }}
              animate={mounted ? { 
                opacity: activeHexId !== null && !isSlideshowActive ? 0.4 : 1, 
                x,
                y, 
                filter: activeHexId !== null && !isSlideshowActive ? 'blur(4px)' : 'blur(0px)' 
              } : {}}
              transition={{
                duration: mounted ? 0.8 : 1,
                delay: mounted ? 0 : index * 0.15,
                ease: "easeOut"
              }}
              className="absolute top-10 left-1/2 cursor-pointer" 
              style={{
                marginLeft: `-${W / 2}px`,
                width: `${W}px`,
                zIndex: isSlideshowActive ? 100 : hex.row,
              }}
            >
              <div className="relative w-full">
                {/* Structural invisible image */}
                <Image 
                  src={hex.src} 
                  alt="placeholder" 
                  width={200}
                  height={230}
                  priority // Гарантирует загрузку главного экрана без задержек
                  quality={65} // Оптимизация веса PNG
                  className="w-full h-auto opacity-0 pointer-events-none" 
                />
                
                <AnimatePresence>
                  <motion.div
                    key={displaySrc}
                    // Плавный морфизм с легким эффектом глубины вместо резкого блюра
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full drop-shadow-2xl"
                  >
                    <Image 
                      src={displaySrc} 
                      alt={`Office ${hex.id}`} 
                      fill
                      sizes="(max-width: 768px) 100px, 130px"
                      quality={65} // Сильная оптимизация веса для сменяющихся картинок
                      priority
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence>
                  {isSlideshowActive && showBadges && activeCase && (
                    <>
                      {/* Left Badge (Before) */}
                      <div className="absolute bottom-[5%] left-[30%] -translate-x-full z-[100] pointer-events-none drop-shadow-lg">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, filter: 'blur(2px)' }}
                        >
                          <div 
                            className="backdrop-blur-md text-[8px] md:text-[10px] font-semibold pl-2 md:pl-3 pr-4 md:pr-5 py-1 text-white whitespace-nowrap bg-slate-900"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)' }}
                          >
                            {activeCase.before}
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Progress Pillar */}
                      <div className="absolute bottom-[5%] left-[25%] right-[25%] z-[90] pointer-events-none">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, filter: 'blur(2px)' }}
                        >
                          <div className="relative w-full bg-white/20 backdrop-blur-md text-[8px] md:text-[10px] py-1 font-bold text-white whitespace-nowrap overflow-hidden flex items-center justify-center shadow-inner">
                            <div className="relative z-10 drop-shadow-md">
                              <ProgressCounter days={activeCase.days} /> days
                            </div>
                            <motion.div 
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 4.5, ease: 'easeInOut' }} // Синхронизировано с новым таймингом слайдов
                              className="absolute top-0 left-0 h-full bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Right Badge (After) */}
                      <div className="absolute bottom-[5%] right-[30%] translate-x-full z-[100] pointer-events-none drop-shadow-lg">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, filter: 'blur(2px)' }}
                        >
                          <div 
                            className="backdrop-blur-md text-[8px] md:text-[10px] font-bold pr-2 md:pr-3 pl-4 md:pl-5 py-1 text-white whitespace-nowrap bg-blue-600"
                            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 6px 100%, 0 50%)' }}
                          >
                            {activeCase.after}
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}