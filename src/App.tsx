import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ArrowUpRight, AudioLines, Music, Mic, Users, Loader2, Code2, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Blob, { BlobVariant } from './components/Blob';
import ProcessDiagram from './components/ProcessDiagram';

const TABS: { id: BlobVariant; label: string; icon: React.ElementType<{ className?: string }>; heading: React.ReactNode; description: string }[] = [
  {
    id: 'agents',
    label: 'Eleven Agents',
    icon: AudioLines,
    heading: <>Your Voice. Any<br />Language. Infinite Scale.</>,
    description: "Generate natural speech in seconds. Clone voices with precision. Deploy across apps, videos, podcasts, and products. Fast. Reliable. Studio-grade quality."
  },
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    heading: <>Create Music.<br />From Text. Instantly.</>,
    description: "Compose original tracks, generate sound effects, and produce high-quality audio from simple text prompts. Your personal AI music studio."
  },
  {
    id: 'speech',
    label: 'Speech to Text',
    icon: Mic,
    heading: <>Transcribe Audio.<br />With Perfect Accuracy.</>,
    description: "Convert spoken language into highly accurate text. Perfect for subtitles, meeting notes, and content accessibility across dozens of languages."
  },
  {
    id: 'cloning',
    label: 'Voice Cloning',
    icon: Users,
    heading: <>Clone Any Voice.<br />With Studio Quality.</>,
    description: "Create a digital replica of your voice with just a few minutes of audio. Maintain emotion, pacing, and nuance with unparalleled realism."
  }
];

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<BlobVariant>('agents');
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [showUI, setShowUI] = useState(false);

  const { scrollY } = useScroll({ container: scrollRef });
  const heroBgY = useTransform(scrollY, [0, 1000], ['0%', '40%']);
  const heroBgOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const heroTextOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const activeTabData = TABS.find(t => t.id === activeTab) || TABS[0];

  const handleCanvasCreated = () => {
    setCanvasLoaded(true);
    // Wait a moment to show off the 3D before animating UI
    setTimeout(() => {
      setShowUI(true);
    }, 1200);
  };

  return (
    <div ref={scrollRef} className="relative w-full h-screen bg-white font-sans text-black overflow-x-hidden overflow-y-auto snap-y snap-mandatory">
      <section className="relative w-full h-screen overflow-hidden snap-start shrink-0">
        {/* Loader */}
        <AnimatePresence>
          {!canvasLoaded && (
            <motion.div 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            >
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Background */}
      <motion.div 
        style={{ y: heroBgY, opacity: heroBgOpacity }}
        className="absolute inset-0 z-0"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: canvasLoaded ? 1 : 0, scale: canvasLoaded ? 1 : 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} onCreated={handleCanvasCreated}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0044ff" />
            <pointLight position={[0, 0, 0]} intensity={2} color="#00aaff" />
            <Suspense fallback={null}>
              <AnimatePresence mode="wait">
                <Blob key={activeTab} variant={activeTab} />
              </AnimatePresence>
              <Environment preset="city" />
              <EffectComposer>
                <Bloom 
                  luminanceThreshold={0.2} 
                  mipmapBlur 
                  intensity={1.5} 
                  radius={0.6}
                />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </motion.div>
      </motion.div>

      {/* UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            style={{ y: heroTextY, opacity: heroTextOpacity }}
            className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-8 pointer-events-none"
          >
            {/* Navbar */}
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-between pointer-events-auto gap-4"
            >
          <div className="text-xl font-bold tracking-tight whitespace-nowrap shrink-0">11ElevenLabs</div>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-normal text-gray-400">
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Creative Platform</a>
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Agents Platform</a>
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Developers</a>
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Resources</a>
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Enterprise</a>
            <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Pricing</a>
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors whitespace-nowrap">Log in</a>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors whitespace-nowrap"
            >
              Sign up <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.header>

            {/* Sidebar / Top Navigation on Mobile */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-24 left-0 right-0 flex flex-row flex-wrap justify-center gap-2 px-4 pointer-events-auto md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3 md:right-0 xl:left-0 xl:right-auto md:items-end xl:items-start md:justify-start md:px-0"
            >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 group cursor-pointer md:flex-row-reverse xl:flex-row shrink-0 ${isActive ? 'bg-white border border-gray-200 shadow-sm rounded-full px-3 py-1.5 md:bg-transparent md:border-transparent md:shadow-none md:p-0 md:rounded-none' : 'px-3 py-1.5 rounded-full md:p-0 md:rounded-none hover:bg-gray-50 md:hover:bg-transparent'}`}
              >
                <div className={`w-8 h-[1px] transition-colors ${isActive ? 'bg-gray-400' : 'bg-gray-200 group-hover:bg-gray-300'} hidden md:block`} />
                <div className={`flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-medium transition-colors whitespace-nowrap ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {isActive ? (
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[#444444] flex items-center justify-center text-white shadow-sm shrink-0">
                      <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 flex items-center justify-center">
                      <Icon className="w-2.5 h-2.5 md:w-3 md:h-3 opacity-50 md:opacity-0 group-hover:opacity-50 transition-opacity" />
                    </div>
                  )}
                  {tab.label}
                </div>
              </div>
            );
          })}
        </motion.div>

            {/* Bottom Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-full pointer-events-auto mt-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6 lg:gap-8 w-full bg-white/80 backdrop-blur-xl p-6 rounded-3xl md:bg-transparent md:backdrop-blur-none md:p-0 md:rounded-none text-center lg:text-left"
                >
                  <h1 className="font-handjet text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-medium tracking-normal leading-[0.9] max-w-3xl">
                    {activeTabData.heading}
                  </h1>
                  <div className="flex flex-col items-center lg:items-start gap-6 max-w-sm pb-2 lg:pb-4 shrink-0">
                    <p className="text-xs text-gray-500 leading-relaxed font-normal">
                      {activeTabData.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors whitespace-nowrap w-full sm:w-auto"
                      >
                        Start creating for free <ArrowUpRight className="w-3 h-3" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white border border-gray-200 text-black px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap w-full sm:w-auto"
                      >
                        Contact Sales
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>

      {/* New Section: Features */}
      <section className="relative w-full min-h-screen bg-[#f9f9f9] text-black overflow-hidden flex flex-col items-center py-24 z-20 snap-start shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-7xl mx-auto px-6 md:px-8 z-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24">
            <h2 className="font-handjet text-5xl md:text-[4.5rem] font-medium leading-[1.1] max-w-2xl tracking-tight">
              Research that redefines<br/>human technology interaction
            </h2>
            <p className="text-gray-800 max-w-md text-base md:text-lg mt-6 md:mt-0 leading-relaxed font-normal">
              Our vision is to make communication and creation with technology seamless. We build our own foundational models, beginning with the first human-like voice model and now extending far beyond voice.
            </p>
          </div>
          
          {/* Timeline Component */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full bg-[#f2f2f2] rounded-3xl p-6 md:p-16 relative flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="w-full flex items-center justify-between relative z-10">
              <button className="w-10 h-10 md:w-12 md:h-12 bg-gray-300/50 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              {/* Timeline Track */}
              <div 
                className="flex-1 mx-4 md:mx-8 relative h-32 flex items-center"
              >
                <div className="absolute inset-0 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                  <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    className="flex items-center h-full w-max"
                  >
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-center w-12 md:w-16 shrink-0">
                        <div className={`w-[1px] ${i % 5 === 0 ? 'h-6 bg-gray-400' : 'h-3 bg-gray-300'}`} />
                      </div>
                    ))}
                  </motion.div>
                </div>
                
                {/* Active Marker */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute left-1/2 md:left-auto md:right-[20%] -translate-x-1/2 md:translate-x-0 flex flex-col items-center z-10"
                >
                  <span className="text-sm md:text-base font-medium mb-2 md:mb-4 font-handjet tracking-wide whitespace-nowrap">Scribe v2</span>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: 60 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="w-[2px] bg-black rounded-full relative shadow-[0_0_15px_rgba(0,0,0,0.1)] md:h-[80px]" 
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mt-4 md:mt-6 text-center"
                  >
                    <p className="text-xs md:text-sm font-medium text-gray-900 max-w-[150px] md:max-w-[200px] leading-snug">The most accurate transcription model ever released</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Jan 2026</p>
                  </motion.div>
                </motion.div>
              </div>

              <button className="w-10 h-10 md:w-12 md:h-12 bg-gray-300/50 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </motion.div>

          {/* Detailed Cards for Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group hover:bg-black transition-colors duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <Code2 className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-handjet tracking-wide font-medium mb-3 text-black group-hover:text-white transition-colors duration-300">Developer API</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">Integrate our state-of-the-art voice models directly into your applications with our robust and low-latency API.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group hover:bg-black transition-colors duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <Zap className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-handjet tracking-wide font-medium mb-3 text-black group-hover:text-white transition-colors duration-300">Ultra-Fast Generation</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">Experience unprecedented speed in audio synthesis, enabling real-time conversational agents and dynamic content creation.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group hover:bg-black transition-colors duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <Globe className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-handjet tracking-wide font-medium mb-3 text-black group-hover:text-white transition-colors duration-300">Multilingual Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">Generate speech in dozens of languages with native-sounding accents and perfect pronunciation across the globe.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Latest Updates Section */}
      <section className="relative w-full min-h-screen bg-white text-black overflow-hidden flex flex-col items-center py-24 z-20 snap-start shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-7xl mx-auto px-6 md:px-8 z-10"
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-handjet text-5xl md:text-6xl font-medium tracking-tight">Latest updates</h2>
            <button className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
              All posts
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-3xl overflow-hidden mb-6 relative bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtNS41IDAtMTAtNC41LTEwLTEwUzE0LjUgMCAyMCAwczEwIDQuNSAxMCAxMC00LjUgMTAtMTAgMTB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <h3 className="font-handjet text-white text-4xl font-medium leading-tight tracking-wide">ElevenLabs<br/>for Government</h3>
                </div>
              </div>
              <h4 className="font-handjet text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors tracking-wide">Introducing ElevenLabs<br/>for Government</h4>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-3xl overflow-hidden mb-6 relative bg-gradient-to-br from-gray-300 via-green-800 to-green-950">
                <div className="absolute top-8 left-0 right-0 flex justify-center">
                  <span className="text-white/80 text-sm font-medium tracking-wider">IIEleven<span className="opacity-70">Agents</span></span>
                </div>
                <div className="absolute inset-0 flex items-end justify-center pb-16 text-center">
                  <h3 className="font-handjet text-white text-4xl font-medium leading-tight tracking-wide">Expressive<br/>mode</h3>
                </div>
              </div>
              <h4 className="font-handjet text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors tracking-wide">Introducing Expressive Mode for<br/>ElevenAgents</h4>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-3xl overflow-hidden mb-6 relative bg-gradient-to-br from-blue-800 via-orange-500 to-orange-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="font-handjet text-white text-[7rem] font-medium leading-none tracking-tighter">$11B</h3>
                  <p className="text-white/90 text-sm font-medium mt-2">ElevenLabs Series D</p>
                </div>
              </div>
              <h4 className="font-handjet text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors tracking-wide">ElevenLabs raises $500M Series D at<br/>$11B valuation</h4>
            </motion.div>
          </div>
        </motion.div>
      </section>



      {/* Section 3: Audit Process */}
      <section className="relative w-full min-h-screen bg-[#fafafa] text-black overflow-hidden flex flex-col items-center justify-center py-24 z-20 snap-start shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-7xl mx-auto px-6 md:px-8 z-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 border-b border-gray-200 pb-12">
            <div className="flex flex-col gap-4">
              <span className="text-blue-600 font-mono text-sm tracking-wider font-semibold uppercase">
                [OUR AUDIT PROCESS]
              </span>
              <h2 className="text-5xl md:text-6xl font-sans tracking-tight text-gray-900">
                Our Smart Contract<br/>
                <span className="font-bold">Audit Process</span>
              </h2>
            </div>
            <p className="text-gray-500 max-w-md text-sm md:text-base mt-6 md:mt-0 leading-relaxed font-sans">
              We specialize in identifying and remedying vulnerabilities with precision, offering robust solutions for secure smart contracts. Partner with us to ensure your project's security is fortified by a meticulous and experienced team.
            </p>
          </div>
          
          <ProcessDiagram />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-[#0a0a0a] text-white py-16 px-6 md:px-12 overflow-hidden snap-start shrink-0">
        {/* Glow background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-purple-600/40 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full justify-between min-h-[500px]">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div>
              <p className="text-gray-500 text-sm mb-2">Live Limitless</p>
              <h3 className="font-handjet text-4xl md:text-5xl font-medium tracking-wide">hello@elevenlabs.io</h3>
            </div>
            <div className="text-left md:text-right">
              <p className="text-white font-medium mb-2">Upgrade Your Reality</p>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">Join the waitlist and get priority access.</p>
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Join Waitlist
              </button>
            </div>
          </div>

          {/* Massive Scrolling Text */}
          <div className="w-full overflow-hidden mb-24 relative flex whitespace-nowrap">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 20
              }}
              className="flex items-center"
            >
              {/* First Set */}
              <div className="flex items-center">
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
              </div>
              {/* Second Set (Duplicate for seamless loop) */}
              <div className="flex items-center">
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
                <h1 className="font-sans text-[12vw] font-bold leading-none tracking-tighter text-white pr-16">
                  11ELEVENLABS
                </h1>
              </div>
            </motion.div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 text-sm font-sans">
            {/* Col 1 */}
            <div className="flex flex-col gap-6">
              <div className="text-xl font-bold tracking-tight text-white">11ElevenLabs</div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-medium">Products</h4>
                <div className="flex flex-col gap-3 text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">Text to Speech</a>
                  <a href="#" className="hover:text-white transition-colors">Voice Changer</a>
                  <a href="#" className="hover:text-white transition-colors">AI Music Generator</a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-medium">Resources</h4>
                <div className="flex flex-col gap-3 text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="hover:text-white transition-colors">Docs</a>
                </div>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-medium">API</h4>
                <div className="flex flex-col gap-3 text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">API Reference</a>
                  <a href="#" className="hover:text-white transition-colors">Agents API</a>
                  <a href="#" className="hover:text-white transition-colors">Dubbing API</a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-medium">Company</h4>
                <div className="flex flex-col gap-3 text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">About</a>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                  <a href="#" className="hover:text-white transition-colors">Terms & Privacy</a>
                </div>
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-medium">Socials</h4>
                <div className="flex flex-col gap-3 text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">X (Twitter)</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-white transition-colors">GitHub</a>
                  <a href="#" className="hover:text-white transition-colors">Discord</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
