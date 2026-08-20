"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Types & Interfaces ---
type NodeType = 'rect' | 'diamond' | 'start' | 'end';

interface FlowNode {
  id: string;
  type: NodeType;
  cx: number;
  cy: number;
  label: string;
  delayIdx: number;
}

interface FlowEdge {
  from: string;
  to: string;
  delayIdx: number;
  label?: string;
  points?: string;
}

// --- Constants ---
const LABELS_RECT = ['Review', 'Audit', 'Meeting', 'Email', 'Escalate', 'Document', 'Sign-off', 'Call', 'Assess', 'Approve', 'Wait', 'Sync', 'Process', 'Update'];
const LABELS_DIAMOND = ['Approved?', 'In Stock?', 'Risk Low?', 'Found?', 'Matches?', 'Valid?', 'Ready?', 'Pass?', 'Failed?'];

// --- Utility Functions ---
function generateFlowData() {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  
  const generateId = () => Math.random().toString(36).substring(2, 9);

  function addNode(type: NodeType, cx: number, cy: number, label: string, delayIdx: number) {
    const node: FlowNode = { id: generateId(), type, cx, cy, label, delayIdx };
    nodes.push(node);
    return node;
  }

  function addEdge(from: string, to: string, delayIdx: number, label: string, points: string) {
    edges.push({ from, to, delayIdx, label, points });
  }

  const getLabel = (type: NodeType) => {
    if (type === 'diamond') return LABELS_DIAMOND[Math.floor(Math.random() * LABELS_DIAMOND.length)];
    return LABELS_RECT[Math.floor(Math.random() * LABELS_RECT.length)];
  };

  const gridX = [100, 350, 600, 850, 1100, 1350, 1600, 1850, 2100, 2350];
  const gridY = [100, 250, 400, 550, 700, 850, 1000, 1150, 1300, 1450, 1600];
  const nodeGrid: Record<string, { id: string, x: number, y: number, type: NodeType }> = {};

  // Build grid nodes
  for (let i = 0; i < gridX.length; i++) {
    for (let j = 0; j < gridY.length; j++) {
      const x = gridX[i];
      const y = gridY[j];
      
      // Leave empty space in the center for the main headline
      const isCenter = x >= 600 && x <= 1800 && y >= 650 && y <= 950;
      if (isCenter || Math.random() > 0.85) continue;

      const type = Math.random() > 0.75 ? 'diamond' : 'rect';
      const delayIdx = Math.floor(Math.random() * 50);
      const node = addNode(type, x, y, getLabel(type), delayIdx);
      nodeGrid[`${i},${j}`] = { id: node.id, x, y, type };
    }
  }

  // Generate orthogonal paths between nodes
  const getOrthogonalPath = (n1: {x: number, y: number, type: NodeType}, n2: {x: number, y: number, type: NodeType}) => {
    const w1 = n1.type === 'diamond' ? 75 : 80;
    const h1 = n1.type === 'diamond' ? 45 : 30;
    const w2 = n2.type === 'diamond' ? 75 : 80;
    const h2 = n2.type === 'diamond' ? 45 : 30;

    let startX = n1.x, startY = n1.y, endX = n2.x, endY = n2.y;
    
    if (n1.x === n2.x) {
      startY = n1.y + (n1.y < n2.y ? h1 : -h1);
      endY = n2.y + (n2.y < n1.y ? h2 : -h2);
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }
    
    if (n1.y === n2.y) {
      startX = n1.x + (n1.x < n2.x ? w1 : -w1);
      endX = n2.x + (n2.x < n1.x ? w2 : -w2);
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }
    
    if (Math.random() > 0.5) {
      startX = n1.x + (n1.x < n2.x ? w1 : -w1);
      endY = n2.y + (n2.y < n1.y ? h2 : -h2);
      return `M ${startX} ${n1.y} L ${n2.x} ${n1.y} L ${n2.x} ${endY}`;
    } else {
      startY = n1.y + (n1.y < n2.y ? h1 : -h1);
      endX = n2.x + (n2.x < n1.x ? w2 : -w2);
      return `M ${n1.x} ${startY} L ${n1.x} ${n2.y} L ${endX} ${n2.y}`;
    }
  };

  // Connect edges based on proximity and probability
  Object.keys(nodeGrid).forEach(k => {
    const [i, j] = k.split(',').map(Number);
    const current = nodeGrid[k];
    
    if (nodeGrid[`${i+1},${j}`] && Math.random() > 0.2) {
      const target = nodeGrid[`${i+1},${j}`];
      addEdge(current.id, target.id, Math.floor(Math.random() * 50), Math.random() > 0.8 ? 'Yes' : '', getOrthogonalPath(current, target));
    }
    
    if (nodeGrid[`${i},${j+1}`] && Math.random() > 0.2) {
      const target = nodeGrid[`${i},${j+1}`];
      addEdge(current.id, target.id, Math.floor(Math.random() * 50), Math.random() > 0.8 ? 'No' : '', getOrthogonalPath(current, target));
    }
    
    if (nodeGrid[`${i+1},${j+1}`] && Math.random() > 0.7) {
      const target = nodeGrid[`${i+1},${j+1}`];
      addEdge(current.id, target.id, Math.floor(Math.random() * 50), '', getOrthogonalPath(current, target));
    }
    
    if (nodeGrid[`${i-1},${j}`] && Math.random() > 0.8) {
      const target = nodeGrid[`${i-1},${j}`];
      addEdge(current.id, target.id, Math.floor(Math.random() * 50), 'Fail', getOrthogonalPath(current, target));
    }
  });

  return { nodes, edges };
}

// --- Animation Variants (Optimized for Loop with explicit Types) ---
const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom: number) => ({
    pathLength: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 5,
      delay: custom * 0.08,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      times: [0, 0.4, 0.6, 1]
    }
  })
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (custom: number) => ({
    opacity: [0, 1, 1, 0], 
    scale: [0.8, 1, 1, 0.8],
    transition: {
      duration: 5,
      delay: custom * 0.08 + 0.05,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      times: [0, 0.4, 0.6, 1]
    }
  })
};

// --- Components ---
const FlowchartText = ({ label, x, y, isStartEnd }: { label: string; x: number; y: number; isStartEnd: boolean }) => {
  const words = label.split(' ');
  let lines = [];
  
  if (words.length > 2) {
    lines = [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')];
  } else if (words.length === 2 && label.length > 12) {
    lines = words;
  } else {
    lines = [label];
  }
  
  return (
    <>
      {lines.map((line, i) => (
        <tspan 
          key={i} 
          x={x} 
          dy={i === 0 ? (lines.length === 1 ? '0.3em' : '-0.2em') : '1.2em'}
        >
          {line}
        </tspan>
      ))}
    </>
  );
};

function AnimatedFlowchart() {
  const [flowData, setFlowData] = useState<{nodes: FlowNode[], edges: FlowEdge[]}>({nodes: [], edges: []});
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Генерируем граф один раз. Анимация зациклена через Framer Motion (repeat: Infinity).
    // Это избавляет DOM от постоянной перерисовки и перерасчета узлов.
    setFlowData(generateFlowData());
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none overflow-hidden flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {flowData.nodes.length > 0 && (
          <motion.svg 
            key="flowchart-svg"
            viewBox="0 0 2400 1600" 
            className="w-full h-full min-w-[1200px] text-slate-800 dark:text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6"
                  orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            
            {flowData.edges.map((edge, i) => {
              const n1 = flowData.nodes.find(n => n.id === edge.from);
              const n2 = flowData.nodes.find(n => n.id === edge.to);
              if (!n1 || !n2) return null;
              
              const path = edge.points || '';
              
              return (
                <g key={`edge-${i}`}>
                  <motion.path 
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                    variants={pathVariants}
                    custom={edge.delayIdx}
                  />
                  {edge.label && (
                    <motion.text
                      x={n1.cx === n2.cx ? n1.cx + 15 : (n1.cx + n2.cx) / 2}
                      y={n1.cx === n2.cx ? (n1.cy + n2.cy) / 2 : n1.cy - 10}
                      fill="currentColor"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      variants={nodeVariants}
                      custom={edge.delayIdx + 0.15}
                    >
                      {edge.label}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {flowData.nodes.map((node) => (
              <motion.g 
                key={`node-${node.id}`}
                variants={nodeVariants}
                custom={node.delayIdx}
              >
                {node.type === 'rect' && (
                  <rect 
                    x={node.cx - 80} 
                    y={node.cy - 30} 
                    width="160" 
                    height="60" 
                    rx="8"
                    className="fill-white dark:fill-slate-900"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
                {(node.type === 'start' || node.type === 'end') && (
                  <rect 
                    x={node.cx - 80} 
                    y={node.cy - 30} 
                    width="160" 
                    height="60" 
                    rx="30"
                    fill={node.type === 'start' ? '#0f172a' : '#10b981'}
                    stroke={node.type === 'start' ? '#0f172a' : '#10b981'}
                    strokeWidth="2"
                  />
                )}
                {node.type === 'diamond' && (
                  <polygon 
                    points={`${node.cx},${node.cy - 45} ${node.cx + 75},${node.cy} ${node.cx},${node.cy + 45} ${node.cx - 75},${node.cy}`}
                    className="fill-white dark:fill-slate-900"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
                <text 
                  x={node.cx} 
                  y={node.cy} 
                  fill={(node.type === 'start' || node.type === 'end') ? 'white' : 'currentColor'} 
                  fontSize="13" 
                  fontWeight="600"
                  textAnchor="middle" 
                  dominantBaseline="middle"
                >
                  <FlowchartText label={node.label} x={node.cx} y={node.cy} isStartEnd={node.type === 'start' || node.type === 'end'} />
                </text>
              </motion.g>
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StopWastingTime() {
  return (
    <section className="min-h-[60vh] md:min-h-[70vh] flex items-center justify-center py-24 md:py-32 bg-white dark:bg-slate-950 relative overflow-hidden font-sans border-t border-border-primary">
      <AnimatedFlowchart />
      
      {/* Refined gradient glow (Responsive) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] sm:max-w-[500px] md:max-w-[800px] h-[300px] md:h-[400px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-[50%] blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tighter leading-tight drop-shadow-sm dark:drop-shadow-none"
          >
            Stop wasting months on <br className="hidden sm:block" /> setup and hiring.
          </motion.h2>
        </div>
      </div>
    </section>
  );
}