"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { motion, AnimatePresence, animate } from 'framer-motion';

import { USClosersLogo } from './USClosersLogo';

const STEPS = [
  { id: 1, title: 'Recruiting & Hiring', desc: 'Sourcing top\nsales talent.' },
  { id: 2, title: 'CRM & Pipelines', desc: 'Building digital infrastructure.' },
  { id: 3, title: 'Playbooks & Scripts', desc: 'Creating outreach strategies.' },
  { id: 4, title: 'Lead Building', desc: 'Validating prospect databases.' },
  { id: 5, title: 'Training & Optimizing', desc: 'Educating reps on product value.' },
];

type PanelData = {
  calls: number;
  sales: number;
  budget: number;
  tts: number;
  image: string;
};

type ChecklistItem = {
  text: string;
  with?: boolean;
  without?: boolean;
  step?: number;
  isHeader?: boolean;
};

type StateData = {
  withoutService: PanelData;
  withService: PanelData;
  leftTasks: ChecklistItem[];
  rightTasks: ChecklistItem[];
};

type WeekData = {
  week: number;
  title: string;
  activeSteps: number[];
  defaultState: StateData;
  stepHoverStates: Record<number, StateData>;
};

const STEP_TASKS: Record<number, ChecklistItem[]> = {
  1: [
    { text: "5 sales reps hired and assigned", without: false, with: true, step: 1 },
    { text: "3 onboarding modules completed", without: false, with: true, step: 1 },
    { text: "5/5 signed with background checks", without: false, with: true, step: 1 },
  ],
  2: [
    { text: "1 CRM platform with 5 seats", without: false, with: true, step: 2 },
    { text: "4 sales pipelines & 6 deal stages", without: false, with: true, step: 2 },
    { text: "5 VoIP phone lines integrated", without: false, with: true, step: 2 },
  ],
  3: [
    { text: "3 scripts and 5 follow-up email", without: false, with: true, step: 3 },
    { text: "1 objection playbook 15+ counters", without: false, with: true, step: 3 },
    { text: "3 multi-channel outreach sequences", without: false, with: true, step: 3 },
  ],
  4: [
    { text: "2 Ideal Customer Profiles approved", without: false, with: true, step: 4 },
    { text: "2,500+ verified B2B leads extracted", without: false, with: true, step: 4 },
    { text: "100% of contact emails validated", without: false, with: true, step: 4 },
  ],
  5: [
    { text: "5/5 reps certified", without: false, with: true, step: 5 },
    { text: "20+ hours of live pitch practice", without: false, with: true, step: 5 },
    { text: "7 key performance metrics analyzed", without: false, with: true, step: 5 },
    { text: "2 core scripts optimized", without: false, with: true, step: 5 },
  ],
};

const getLeftTasks = (step: number): ChecklistItem[] => {
  const maxGroups = step === 4 ? 2 : step === 5 ? 3 : 1;
  const tasks: ChecklistItem[] = [];
  for (let i = 1; i <= maxGroups; i++) {
    if (STEP_TASKS[i]) tasks.push(...STEP_TASKS[i]);
  }
  return tasks;
};

const getRightTasks = (step: number): ChecklistItem[] => {
  const tasks: ChecklistItem[] = [];
  for (let i = 1; i <= step; i++) {
    if (STEP_TASKS[i]) tasks.push(...STEP_TASKS[i]);
  }
  return tasks;
};

interface TaskCardProps {
  item: ChecklistItem;
  isWithout: boolean;
  index: number;
  totalTasks: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ item, isWithout, index, totalTasks }) => {
  const [pos] = useState(() => {
    // Идеальное распределение по спирали (Золотой угол), чтобы карточки не накладывались
    const angle = index * 2.4; 
    // Радиус увеличивается с каждой карточкой, раскидывая их от центра к краям комнаты
    const radiusScale = 0.3 + ((index + 1) / Math.max(totalTasks, 1)) * 0.7; 
    
    // Эллипс, повторяющий изометрию комнаты
    const rx = 38 * radiusScale; // Горизонтальный разлет (38%)
    const ry = 25 * radiusScale; // Вертикальный разлет (25%)
    
    return {
      top: 50 + Math.sin(angle) * ry,
      left: 50 + Math.cos(angle) * rx,
      rotate: -5 + Math.random() * 10 // Легкий и аккуратный наклон
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%", rotate: pos.rotate - 10 }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", rotate: pos.rotate }}
      exit={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
      transition={{ delay: 0.04 * (index % 5), type: "spring", stiffness: 300, damping: 25 }}
      className={`absolute bg-background-primary shadow-lg rounded-lg border p-1.5 pr-3 flex items-center gap-2 z-20 w-max max-w-[140px] transition-theme ${
        isWithout ? 'border-border-primary opacity-90' : 'border-blue-500/30 dark:border-blue-500/40'
      }`}
      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-theme ${
        isWithout 
          ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' 
          : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
      }`}>
        <Check className={`w-3 h-3 ${isWithout ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
      </div>
      <span className={`text-[9px] sm:text-[10px] font-bold whitespace-normal text-left leading-tight transition-theme pointer-events-none ${
        isWithout ? 'text-text-secondary opacity-80' : 'text-text-primary'
      }`}>
        {item.text}
      </span>
    </motion.div>
  );
};

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(prevValue.current, value, {
        duration: 0.8,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = prefix + Math.round(v).toLocaleString() + suffix;
        }
      });
      prevValue.current = value;
      return () => controls.stop();
    }
  }, [value, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}{value.toLocaleString()}{suffix}</span>;
};

const STEP_STATES: Record<number, StateData> = {
  1: {
    withoutService: { calls: 0, sales: 0, budget: 5000, tts: 14, image: '/images/old_rooms/17.png' },
    withService: { calls: 0, sales: 0, budget: 1500, tts: 3, image: '/images/old_rooms/6.png' },
    leftTasks: getLeftTasks(1), rightTasks: getRightTasks(1)
  },
  2: {
    withoutService: { calls: 0, sales: 0, budget: 7500, tts: 21, image: '/images/old_rooms/17.png' },
    withService: { calls: 0, sales: 0, budget: 3000, tts: 7, image: '/images/old_rooms/12.png' },
    leftTasks: getLeftTasks(2), rightTasks: getRightTasks(2)
  },
  3: {
    withoutService: { calls: 0, sales: 0, budget: 10000, tts: 35, image: '/images/old_rooms/6.png' },
    withService: { calls: 10, sales: 0, budget: 5000, tts: 14, image: '/images/old_rooms/3.png' },
    leftTasks: getLeftTasks(3), rightTasks: getRightTasks(3)
  },
  4: {
    withoutService: { calls: 10, sales: 0, budget: 15000, tts: 39, image: '/images/old_rooms/6.png' },
    withService: { calls: 30, sales: 0, budget: 7500, tts: 21, image: '/images/old_rooms/7.png' },
    leftTasks: getLeftTasks(4), rightTasks: getRightTasks(4)
  },
  5: {
    withoutService: { calls: 30, sales: 0, budget: 30000, tts: 90, image: '/images/old_rooms/3.png' },
    withService: { calls: 100, sales: 3000, budget: 15000, tts: 30, image: '/images/old_rooms/10.png' },
    leftTasks: getLeftTasks(5), rightTasks: getRightTasks(5)
  }
};

const WEEKS_DATA: WeekData[] = [
  {
    week: 1,
    title: "Week One",
    activeSteps: [1],
    defaultState: STEP_STATES[1],
    stepHoverStates: STEP_STATES
  },
  {
    week: 2,
    title: "Week Two",
    activeSteps: [1, 2, 3],
    defaultState: STEP_STATES[3],
    stepHoverStates: STEP_STATES
  },
  {
    week: 3,
    title: "Week Three",
    activeSteps: [1, 2, 3, 4],
    defaultState: STEP_STATES[4],
    stepHoverStates: STEP_STATES
  },
  {
    week: 4,
    title: "Month Two",
    activeSteps: [1, 2, 3, 4, 5],
    defaultState: STEP_STATES[5],
    stepHoverStates: STEP_STATES
  }
];

export function TimeToFirstCallWidget() {
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);
  const [persistedStep, setPersistedStep] = useState<number | null>(null);

  const stepToWeek = {
    1: 0,
    2: 0,
    3: 1,
    4: 2,
    5: 3
  };

  const currentWeekData = WEEKS_DATA[currentWeekIdx];
  
  const activeState = persistedStep && currentWeekData.stepHoverStates[persistedStep] 
    ? currentWeekData.stepHoverStates[persistedStep] 
    : currentWeekData.defaultState;

  const progressStep = persistedStep || Math.max(...currentWeekData.activeSteps);

  return (
    <section className="py-12 lg:py-16 bg-background-primary overflow-hidden w-full border-b border-border-primary transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-text-primary tracking-tight transition-theme">Time To First Sales Call</h2>
          <p className="text-lg text-text-secondary transition-theme">
            Core resources are spent on organizing processes and preparing workspaces.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mb-6 w-full max-w-5xl mx-auto">
          <div className="flex flex-wrap lg:flex-nowrap items-start justify-center lg:justify-between relative px-4 gap-4 lg:gap-0">
            
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden lg:block absolute top-[44px] left-[80px] right-[80px] h-1.5 bg-background-surface border border-border-primary z-0 rounded-full overflow-hidden transition-theme">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.5)] dark:shadow-[0_0_12px_rgba(59,130,246,0.8)]" 
                style={{ width: `${((progressStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {STEPS.map((step) => {
              const isActive = currentWeekData.activeSteps.includes(step.id);
              const isFocused = persistedStep === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className="relative z-10 flex flex-col items-center w-full sm:w-[45%] lg:w-[140px] cursor-pointer group"
                  onMouseEnter={() => {
                    setCurrentWeekIdx(stepToWeek[step.id as keyof typeof stepToWeek]);
                    setPersistedStep(step.id);
                  }}
                  onClick={() => {
                    setCurrentWeekIdx(stepToWeek[step.id as keyof typeof stepToWeek]);
                    setPersistedStep(step.id);
                  }}
                >
                  <div 
                    className={`w-full py-3 px-2 rounded-2xl text-center text-sm font-semibold mb-3 transition-all duration-300 border min-h-[84px] flex flex-col justify-center items-center gap-1 ${
                      isFocused 
                        ? 'bg-background-primary border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] scale-105 transform-gpu'
                        : isActive 
                        ? 'bg-background-primary border-border-primary text-text-primary shadow-sm group-hover:border-blue-400 group-hover:shadow-md' 
                        : 'bg-background-surface border-border-primary text-text-secondary group-hover:border-border-primary/80'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] mb-1 transition-theme ${isActive ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-background-secondary text-text-secondary'}`}>
                      {step.id}
                    </div>
                    <div className="leading-snug transition-theme">{step.title}</div>
                  </div>
                  <div className={`text-[12px] leading-relaxed text-center whitespace-pre-line transition-theme duration-300 h-12 flex items-start justify-center ${isActive ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content 2 Columns */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 justify-center items-stretch min-h-[400px] max-w-6xl mx-auto relative pt-4 mt-2">
          
          {/* Vertical Divider Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-primary transform -translate-x-1/2 transition-theme"></div>
          
          {/* Left Column: Without Service */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-start relative px-4 md:px-6">
            <div className="flex items-center gap-2 mb-4 justify-center grayscale opacity-60">
              <span className="text-xl font-bold text-text-primary transition-theme">Without</span>
              <div className="flex items-center gap-1.5">
                <USClosersLogo className="w-6 h-6 drop-shadow-sm" />
                <span className="text-xl font-black tracking-tight text-text-primary transition-theme">USclosers</span>
              </div>
            </div>
            
            {/* Without Us Metrics */}
            <div className="flex items-center gap-4 text-center md:text-left justify-around w-full mb-6 bg-background-surface p-3 rounded-xl border border-border-primary transition-theme shadow-sm">
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold mb-1 transition-theme">Calls</div>
                <div className="text-xl font-bold text-text-primary transition-theme">
                  <AnimatedNumber value={activeState.withoutService.calls} />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold mb-1 transition-theme">Sales</div>
                <div className="text-xl font-bold text-text-primary transition-theme">
                  <AnimatedNumber value={activeState.withoutService.sales} prefix="$" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-semibold mb-1 transition-theme">Cost</div>
                <div className="text-xl font-bold text-text-primary transition-theme">
                  <AnimatedNumber value={activeState.withoutService.budget} prefix="$" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-red-500 dark:text-red-400 uppercase font-bold mb-0.5 transition-theme">TTS</div>
                <div className="text-xl font-extrabold text-red-600 dark:text-red-500 transition-theme">
                  <AnimatedNumber value={activeState.withoutService.tts} /> <span className="text-sm font-bold">days</span>
                </div>
              </div>
            </div>

            {/* Контейнер картинки */}
            <div className="relative w-full max-w-[450px] mx-auto flex items-end justify-center h-[260px] sm:h-[300px] lg:h-[340px]">
              <AnimatePresence>
                <motion.div
                  key={activeState.withoutService.image}
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full z-0 scale-110"
                >
                  <Image 
                    src={activeState.withoutService.image} 
                    alt="Office Without Service"
                    fill
                    quality={75}
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain object-bottom drop-shadow-md grayscale opacity-70"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Рендер карточек */}
              <AnimatePresence>
                {activeState.leftTasks.map((item, i) => (
                  <TaskCard key={`without-${item.text}`} item={item} isWithout={true} index={i} totalTasks={activeState.leftTasks.length} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: With Service */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-start relative px-4 md:px-6">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <span className="text-xl font-bold text-text-primary transition-theme">With</span>
              <div className="flex items-center gap-1.5">
                <USClosersLogo className="w-6 h-6 drop-shadow-sm" />
                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200">USclosers</span>
              </div>
            </div>
            
            {/* With Us Metrics */}
            <div className="flex items-center gap-4 text-center md:text-left justify-around w-full mb-6 bg-blue-50/50 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20 transition-theme">
              <div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold mb-1 transition-theme">Calls</div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300 transition-theme">
                  <AnimatedNumber value={activeState.withService.calls} />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold mb-1 transition-theme">Sales</div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300 transition-theme">
                  <AnimatedNumber value={activeState.withService.sales} prefix="$" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold mb-1 transition-theme">Cost</div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300 transition-theme">
                  <AnimatedNumber value={activeState.withService.budget} prefix="$" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-0.5 transition-theme">TTS</div>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 transition-theme">
                  <AnimatedNumber value={activeState.withService.tts} /> <span className="text-sm font-bold">days</span>
                </div>
              </div>
            </div>

            {/* Контейнер картинки */}
            <div className="relative w-full max-w-[450px] mx-auto flex items-end justify-center h-[260px] sm:h-[300px] lg:h-[340px] z-10">
              <AnimatePresence>
                <motion.div
                  key={activeState.withService.image}
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full z-0 scale-110"
                >
                  <Image 
                    src={activeState.withService.image} 
                    alt="Office With Service"
                    fill
                    quality={75}
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain object-bottom drop-shadow-xl dark:drop-shadow-[0_10px_30px_rgba(59,130,246,0.2)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Рендер карточек */}
              <AnimatePresence>
                {activeState.rightTasks.map((item, i) => (
                  <TaskCard key={`with-${item.text}`} item={item} isWithout={false} index={i} totalTasks={activeState.rightTasks.length} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}