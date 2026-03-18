import React from 'react';
import { motion } from 'motion/react';
import { Code2, Search, Bug, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Initial Code Review',
    desc: 'Our auditors analyze the architecture, dependencies, and contract logic to understand the complete protocol design.',
    icon: Code2,
    position: 'right',
    top: '24%',
    zOffset: 240
  },
  {
    id: 2,
    title: 'Security Analysis',
    desc: 'We conduct a deep manual review combined with automated tools to identify security flaws, logic bugs, and attack vectors.',
    icon: Search,
    position: 'left',
    top: '37%',
    zOffset: 120
  },
  {
    id: 3,
    title: 'Exploit Simulation',
    desc: 'We simulate real-world attack scenarios to test how the contract behaves under malicious conditions.',
    icon: Bug,
    position: 'right',
    top: '50%',
    zOffset: 0,
    highlight: true
  },
  {
    id: 4,
    title: 'Detailed Audit Report',
    desc: 'You receive a comprehensive report outlining vulnerabilities, severity levels, and clear remediation steps.',
    icon: FileText,
    position: 'left',
    top: '63%',
    zOffset: -120
  },
  {
    id: 5,
    title: 'Fix Review & Final Certification',
    desc: 'After fixes are implemented, we verify the improvements and issue the final security audit report.',
    icon: CheckCircle,
    position: 'right',
    top: '76%',
    zOffset: -240
  }
];

export default function ProcessDiagram() {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 md:py-24 px-4 font-sans">
      {/* Desktop Layout */}
      <div className="hidden md:block relative h-[800px] w-full">
        
        {/* 3D Isometric Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none" style={{ perspective: '1000px' }}>
          <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
            
            {/* 3D Blocks */}
            {steps.map((step) => (
              <motion.div
                key={`block-${step.id}`}
                className="absolute inset-0"
                style={{ transform: `translateZ(${step.zOffset}px)`, transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0, z: step.zOffset + 50 }}
                whileInView={{ opacity: 1, z: step.zOffset }}
                transition={{ duration: 0.8, delay: step.id * 0.1 }}
              >
                {/* Shadow / Bottom layer */}
                <div 
                  className={`absolute inset-0 rounded-3xl border-2 ${step.highlight ? 'bg-blue-900 border-blue-950' : 'bg-gray-300 border-gray-400'}`}
                  style={{ transform: 'translateZ(-40px)' }}
                />
                {/* Middle layers for solid side */}
                {[...Array(39)].map((_, i) => (
                  <div 
                    key={i}
                    className={`absolute inset-0 rounded-3xl border ${step.highlight ? 'bg-blue-700 border-blue-800' : 'bg-gray-200 border-gray-300'}`}
                    style={{ transform: `translateZ(-${i + 1}px)` }}
                  />
                ))}
                {/* Top face */}
                <div 
                  className={`absolute inset-0 rounded-3xl border-2 flex items-center justify-center
                    ${step.highlight ? 'bg-blue-600 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.5)]' : 'bg-gray-50 border-gray-200'}
                  `}
                  style={{ transform: 'translateZ(0px)' }}
                >
                  {/* Corner dots */}
                  <div className={`absolute top-4 left-4 w-2 h-2 rounded-full ${step.highlight ? 'bg-blue-300' : 'bg-gray-300'}`} />
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${step.highlight ? 'bg-blue-300' : 'bg-gray-300'}`} />
                  <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full ${step.highlight ? 'bg-blue-300' : 'bg-gray-300'}`} />
                  <div className={`absolute bottom-4 right-4 w-2 h-2 rounded-full ${step.highlight ? 'bg-blue-300' : 'bg-gray-300'}`} />
                  
                  {/* Icon */}
                  <div style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}>
                    <step.icon className={`w-12 h-12 ${step.highlight ? 'text-white' : 'text-gray-400'}`} strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Labels */}
        {steps.map((step) => {
          const isLeft = step.position === 'left';
          return (
            <motion.div
              key={`label-${step.id}`}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: step.id * 0.1 + 0.4 }}
              className={`absolute w-[320px] flex flex-col ${isLeft ? 'items-end text-right left-[5%]' : 'items-start text-left right-[5%]'}`}
              style={{ top: step.top, transform: 'translateY(-50%)' }}
            >
              {/* Highlight background glow */}
              {step.highlight && (
                <div className="absolute inset-0 bg-blue-100/50 blur-2xl rounded-full -z-10 scale-150" />
              )}
              
              <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${step.highlight ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step.id}
                </div>
                <h4 className="font-semibold text-lg text-gray-900">{step.title}</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>

              {/* Connecting line */}
              <div className={`absolute top-3 ${isLeft ? '-right-16 lg:-right-32' : '-left-16 lg:-left-32'} w-16 lg:w-32 h-px border-t border-dashed ${step.highlight ? 'border-blue-600' : 'border-gray-300'}`}>
                <div className={`absolute -top-1 ${isLeft ? 'right-0' : 'left-0'} w-2 h-2 rounded-full ${step.highlight ? 'bg-blue-600' : 'bg-gray-300'}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-8 relative mt-8">
        {steps.map((step) => (
          <motion.div
            key={`mobile-${step.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: step.id * 0.1 }}
            className={`flex flex-col gap-2 p-5 rounded-2xl border shadow-sm relative overflow-hidden
              ${step.highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}
            `}
          >
            {step.highlight && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full -mr-10 -mt-10" />
            )}
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${step.highlight ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
              `}>
                {step.id}
              </div>
              <h4 className="font-semibold text-base text-gray-900">{step.title}</h4>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed pl-11 relative z-10">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
