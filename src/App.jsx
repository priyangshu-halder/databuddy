import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  Zap, MonitorPlay, 
  TrendingUp, Megaphone, Palette, 
  ArrowRight,
  ShieldCheck, Cpu, Fingerprint, Menu, X,
  Bot, Rocket, Sparkles, Code2, Leaf
} from 'lucide-react';
// import Logo from './public/databudduLogo.png';
import Typewriter from './components/Typewriter';

// --- STYLES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --accent-blue: #2563eb;
    --glow-blue: #60a5fa;
    --deep-slate: #020617;
    --soft-blue: #f0f9ff;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
    color: var(--deep-slate);
    overflow-x: hidden;
  }

  .fluid-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: 
      radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.25) 0%, transparent 45%),
      radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.2) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(239, 246, 255, 1) 0%, transparent 100%);
  }

  .cyber-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: -1;
    mask-image: radial-gradient(circle at center, black, transparent 80%);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 50px -15px rgba(37, 99, 235, 0.15);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .glass-card:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: var(--glow-blue);
    box-shadow: 0 30px 60px -12px rgba(37, 99, 235, 0.25);
  }

  @keyframes scrollRow {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-scroll {
    display: flex;
    width: max-content;
    animation: scrollRow 40s linear infinite;
  }

  .shine-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: 0.75s;
  }

  .showcase-card:hover .shine-effect {
    left: 150%;
  }

  .cyber-grid-inline {
    background-image: linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(circle at center, black, transparent 80%);
  }

  .orbit-path {
    border: 1px dashed rgba(37, 99, 235, 0.4);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .leaf-particle {
    position: absolute;
    pointer-events: none;
    z-index: 5;
  }

  /* ---- Mobile-specific overrides ---- */
  @media (max-width: 640px) {
    .hero-badge {
      font-size: 9px;
      letter-spacing: 0.1em;
      padding: 8px 14px;
    }

    .animate-scroll {
      animation-duration: 28s;
    }
  }
`;

// --- COMPONENTS ---

const FallingLeaves = () => {
  const [leaves] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 10,
      size: 12 + Math.random() * 25,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, x: `${leaf.left}vw`, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [`${leaf.left}vw`, `${leaf.left + 8}vw`, `${leaf.left - 8}vw`, `${leaf.left}vw`],
            rotate: 720,
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
          className="leaf-particle text-blue-400/30"
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
};

const HelloBot = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isWaving, setIsWaving] = useState(true);
  const botRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsWaving(false), 3500);
    
    const handleMouseMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      setMousePos({ 
        x: Math.max(Math.min(deltaX / 15, 25), -25), 
        y: Math.max(Math.min(deltaY / 15, 20), -20) 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={botRef} className="relative w-64 h-72 sm:w-80 sm:h-96 flex flex-col items-center justify-center scale-90 sm:scale-110">
      <div className="orbit-path w-110 h-110 border-blue-400/20"></div>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="orbit-path w-90 h-90 border-blue-500/30 border-t-transparent"
      ></motion.div>

      <motion.div
        animate={{ 
          rotateY: mousePos.x, 
          rotateX: -mousePos.y,
          y: [0, -10, 0]
        }}
        transition={{ 
          rotateY: { type: "spring", stiffness: 100, damping: 20 },
          rotateX: { type: "spring", stiffness: 100, damping: 20 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }}
        className="relative z-20 w-48 h-48 sm:w-64 sm:h-64 bg-linear-to-br from-blue-700 via-blue-600 to-indigo-900 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 sm:border-8 border-white/30 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden"
      >
        {/* Humanoid Eyebrows */}
        <div className="flex gap-8 sm:gap-12 mb-2 sm:mb-3 w-full justify-center">
          <motion.div 
            animate={{ 
              rotate: mousePos.y > 0 ? -15 : 10, 
              y: mousePos.y > 0 ? 5 : -5 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-2 sm:w-14 sm:h-3 bg-slate-900 rounded-full origin-right"
          />
          <motion.div 
            animate={{ 
              rotate: mousePos.y > 0 ? 15 : -10, 
              y: mousePos.y > 0 ? 5 : -5 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-2 sm:w-14 sm:h-3 bg-slate-900 rounded-full origin-left"
          />
        </div>

        {/* Eyes */}
        <div className="flex gap-6 sm:gap-10">
          {[0, 1].map((i) => (
            <div key={i} className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-950 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-inner">
               <motion.div 
                 animate={{ x: mousePos.x / 4, y: mousePos.y / 4 }}
                 className="w-5 h-5 sm:w-7 sm:h-7 bg-cyan-400 rounded-full shadow-[0_0_20px_cyan]"
               />
            </div>
          ))}
        </div>
        
        {/* Dynamic Mouth */}
        <motion.div 
           animate={{ 
             width: isWaving ? '30px' : (Math.abs(mousePos.x) > 15 ? '22px' : '38px'),
             height: isWaving ? '16px' : (Math.abs(mousePos.y) > 10 ? '20px' : '6px'),
             borderRadius: (isWaving || Math.abs(mousePos.y) > 10) ? '50%' : '40px',
             y: mousePos.y / 2 + 8,
             scale: Math.abs(mousePos.x) > 20 ? 1.2 : 1
           }}
           transition={{ type: "spring", stiffness: 200, damping: 15 }}
           className="bg-slate-900 mt-4 sm:mt-6 shadow-inner flex items-center justify-center overflow-hidden"
        >
           <motion.div 
             animate={{ opacity: isWaving ? 1 : 0 }}
             className="w-full h-1 bg-blue-400/30 blur-sm"
           />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none rounded-[2.5rem] sm:rounded-[3rem]"></div>
      </motion.div>

      <AnimatePresence>
        {isWaving && (
          <motion.div
            initial={{ rotate: -120, opacity: 0, x: 90 }}
            animate={{ rotate: [0, -40, 0, -40, 0], opacity: 1, x: 70 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 3, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="absolute -right-10 sm:-right-15 top-1/2 z-30"
          >
            <div className="relative">
              <div className="w-20 h-10 sm:w-28 sm:h-14 bg-blue-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center font-black text-white text-xs sm:text-sm">
                HELLO! 👋
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 border-r-4 border-b-4 border-white rotate-45 -mt-2"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute w-60 h-60 bg-blue-400 blur-[100px] -z-10 rounded-full"
      />
    </div>
  );
};

const MagneticButton = ({ children, className }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.45, y: y * 0.45 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 12, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl py-3 sm:py-4 border-b border-blue-100 shadow-xl' : 'bg-transparent py-5 sm:py-8'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.15 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/50"
          >
            <img
              src='/databuddyLogo.png'
              alt="DataBuddy Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <span className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">DataBuddy</span>
        </div>

        <div className="hidden md:flex items-center gap-10 font-bold text-slate-500">
          {['Home', 'About', 'Services'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="relative hover:text-blue-600 transition-colors group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
          <MagneticButton className="cursor-pointer">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40">
              Start Growing
            </button>
          </MagneticButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-blue-100 shadow-xl"
          >
            <div className="flex flex-col px-6 py-5 gap-3">
              {['Home', 'About', 'Services'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-700 font-bold text-lg py-2.5 border-b border-slate-100 hover:text-blue-600 transition-colors"
                >
                  {item}
                </a>
              ))}
              <button className="mt-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40 text-left">
                Start Growing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const HeroSection = () => {
  return (
    <section id="home" className="relative pt-28 sm:pt-36 md:pt-48 pb-20 sm:pb-32 md:pb-40 overflow-hidden">
      <FallingLeaves />
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 -z-10 bg-linear-to-b from-blue-200/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-30 grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
        
        {/* --- Left: Text Content --- */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, x: 10 }}
            className="hero-badge inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-blue-700 text-white font-black text-[9px] sm:text-xs mb-6 sm:mb-10 shadow-lg shadow-blue-600/30 uppercase tracking-[0.15em] sm:tracking-[0.2em]"
          >
            <Sparkles size={12} /> AI-POWERED DIGITAL GROWTH AGENCY · 20+ COUNTRIES
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 sm:mb-10 leading-[0.95] pr-0 sm:pr-8 overflow-visible">
            <span className="block hover:translate-x-3 sm:hover:translate-x-6 hover:text-blue-600 transition-all duration-500 cursor-default py-1">Your Smartest</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-600 block py-1">Digital Growth Partner.</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-slate-600 max-w-xl mb-8 sm:mb-14 font-medium leading-relaxed border-l-4 sm:border-l-8 border-blue-600 pl-5 sm:pl-10">
            <Typewriter text="DataBuddy combines AI animation, automation, data analytics, SEO and creative design to help businesses grow faster, operate smarter and dominate their markets globally." />
          </p>
          
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <MagneticButton>
              <button className="px-7 sm:px-12 py-4 sm:py-6 bg-blue-600 text-white rounded-2xl sm:rounded-3xl font-black shadow-2xl shadow-blue-600/50 hover:bg-blue-700 transition-all flex items-center gap-3 sm:gap-4 text-base sm:text-xl overflow-hidden group">
                Accelerate Now <ArrowRight size={20} className="group-hover:translate-x-2 sm:group-hover:translate-x-3 transition-transform" />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button className="px-7 sm:px-12 py-4 sm:py-6 glass-card text-slate-900 rounded-2xl sm:rounded-3xl font-black hover:bg-white transition-all text-base sm:text-xl border-2 border-slate-200">
                Live Demo
              </button>
            </MagneticButton>
          </div>
        </motion.div>

        {/* --- Right / Below: Bot + Stat Cards (visible on ALL screen sizes) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative flex flex-col items-center"
        >
          {/* Bot — scaled down on mobile */}
          <div className="relative flex items-center justify-center w-full h-64 sm:h-80 md:h-96 lg:h-176">
            <div className="scale-75 sm:scale-90 md:scale-100 lg:scale-110 origin-center">
              <HelloBot />
            </div>

            {/* Stat cards — repositioned to sit within the container on all sizes */}
            <motion.div
              drag
              dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-0 glass-card p-3 sm:p-5 lg:p-8 rounded-2xl lg:rounded-[3rem] flex items-center gap-3 lg:gap-6 cursor-move z-40 border-2 border-blue-200 hover:border-blue-500 shadow-2xl"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0">
                <TrendingUp size={18} className="sm:hidden" />
                <TrendingUp size={22} className="hidden sm:block lg:hidden" />
                <TrendingUp size={28} className="hidden lg:block" />
              </div>
              <div>
                <p className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                <p className="text-xl sm:text-2xl lg:text-4xl font-black text-slate-900">+450%</p>
              </div>
            </motion.div>

            <motion.div
              drag
              dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
              className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:bottom-6 md:left-0 glass-card p-3 sm:p-5 lg:p-8 rounded-2xl lg:rounded-[3rem] flex items-center gap-3 lg:gap-6 cursor-move z-40 border-2 border-indigo-200 hover:border-indigo-500 shadow-2xl"
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-indigo-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0">
                <Cpu size={18} className="sm:hidden" />
                <Cpu size={22} className="hidden sm:block lg:hidden" />
                <Cpu size={28} className="hidden lg:block" />
              </div>
              <div>
                <p className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Processing</p>
                <p className="text-xl sm:text-2xl lg:text-4xl font-black text-slate-900">Quantum</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, desc, delay }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]));

  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="glass-card p-8 sm:p-10 md:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[5rem] group border-2 border-transparent hover:border-blue-500 cursor-pointer"
    >
      <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-blue-600 rounded-2xl md:rounded-4xl flex items-center justify-center text-white mb-6 sm:mb-10 md:mb-12 shadow-2xl shadow-blue-600/40 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
        <Icon size={28} className="sm:hidden" />
        <Icon size={40} className="hidden sm:block md:hidden" />
        <Icon size={48} className="hidden md:block" />
      </div>
      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 md:mb-8 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-bold text-base sm:text-lg md:text-xl mb-6 sm:mb-10 md:mb-12">{desc}</p>
      <div className="flex items-center gap-3 sm:gap-4 text-blue-600 font-black text-lg sm:text-xl md:text-2xl group-hover:translate-x-4 sm:group-hover:translate-x-6 transition-all">
         Deploy System <ArrowRight size={22} />
      </div>
    </motion.div>
  );
};

const InteractiveShowcase = () => {
  const images = [
    { title: "NeuroCore", tag: "AI LOGIC", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
    { title: "Void UI", tag: "WEB 4.0", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" },
    { title: "Apex City", tag: "ARCH VIZ", url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800" },
    { title: "Titan Gear", tag: "ROBOTICS", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <section className="py-24 sm:py-36 md:py-52 bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-28 md:mb-40 text-center relative z-10">
         <motion.h2 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 sm:mb-10 tracking-tighter"
         >
           Future <span className="text-blue-500">Manifested.</span>
         </motion.h2>
         <p className="text-slate-400 text-lg sm:text-2xl md:text-3xl font-bold max-w-3xl mx-auto leading-relaxed">
           Explore the projects that are redefining the boundaries of digital possibility through quantum-grade design.
         </p>
      </div>
      
      <div className="flex gap-6 sm:gap-10 md:gap-16 animate-scroll px-4 sm:px-10">
        {[...images, ...images].map((img, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05, y: -20, rotate: 2 }}
            className="w-64 h-48 sm:w-96 sm:h-64 md:w-176 md:h-136 shrink-0 relative rounded-4xl sm:rounded-[3rem] md:rounded-[5rem] overflow-hidden group shadow-[0_20px_60px_-10px_rgba(37,99,235,0.4)]"
          >
            <img src={img.url} className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-[3s]" alt={img.title} />
            <div className="absolute inset-0 bg-linear-to-t from-blue-950/95 via-blue-900/20 to-transparent"></div>
            <div className="absolute inset-0 p-6 sm:p-10 md:p-20 flex flex-col justify-end">
               <span className="text-blue-400 font-black tracking-[0.3em] sm:tracking-[0.5em] text-xs sm:text-sm md:text-lg mb-2 sm:mb-4 md:mb-6 uppercase">{img.tag}</span>
               <h3 className="text-2xl sm:text-4xl md:text-7xl font-black text-white mb-4 sm:mb-6 md:mb-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">{img.title}</h3>
               <button className="bg-white text-slate-950 w-fit px-6 sm:px-10 md:px-14 py-2.5 sm:py-3.5 md:py-5 rounded-2xl md:rounded-3xl font-black text-sm sm:text-base md:text-xl opacity-0 group-hover:opacity-100 transition-all delay-100 translate-y-4 group-hover:translate-y-0">Launch Simulation</button>
            </div>
            <div className="shine-effect"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ecosystemColorMap = {
  blue: "bg-blue-600",
  orange: "bg-orange-600",
  cyan: "bg-cyan-600",
  purple: "bg-purple-600",
};

const EcosystemSection = () => {
   return (
      <section className="py-24 sm:py-36 md:py-52 relative">
         <div className="cyber-grid-inline absolute inset-0 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 sm:gap-24 lg:gap-40 items-center">
            <div className="relative py-8 sm:py-16">
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                 className="absolute -inset-6 sm:-inset-16 border-4 border-dashed border-blue-200 rounded-full"
               ></motion.div>
               
               <div className="grid grid-cols-2 gap-5 sm:gap-8 md:gap-10 relative z-10">
                  {[
                    { icon: ShieldCheck, label: "Vault", color: "blue" },
                    { icon: Rocket, label: "Boost", color: "orange" },
                    { icon: Zap, label: "Core", color: "cyan" },
                    { icon: Fingerprint, label: "Auth", color: "purple" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 6 : -6 }}
                      className="glass-card p-6 sm:p-10 md:p-14 rounded-4xl sm:rounded-[3rem] md:rounded-[5rem] flex flex-col items-center gap-4 sm:gap-6 md:gap-8 border-2 border-white/50"
                    >
                       <div className={`w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-2xl md:rounded-[2.5rem] ${ecosystemColorMap[item.color]} flex items-center justify-center text-white shadow-2xl`}>
                          <item.icon size={28} className="sm:hidden" />
                          <item.icon size={38} className="hidden sm:block md:hidden" />
                          <item.icon size={56} className="hidden md:block" />
                       </div>
                       <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{item.label}</span>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div>
               <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 sm:mb-10 md:mb-12 leading-tight tracking-tighter">
                  Autonomous <br/> <span className="text-blue-600">Growth Engine.</span>
               </h2>
               <p className="text-base sm:text-2xl md:text-3xl text-slate-500 font-bold mb-8 sm:mb-14 md:mb-16 leading-relaxed">
                  We integrate advanced robotic algorithms into your sales funnel, creating a self-sustaining ecosystem that optimizes performance in real-time.
               </p>
               <div className="space-y-4 sm:space-y-8 md:space-y-10 mb-10 sm:mb-16 md:mb-20">
                  {["Neural-Link Automation", "Synthetic Brand Voices", "Quantum Analytics Dashboard"].map((t, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 20, backgroundColor: "rgba(255,255,255,1)" }}
                      className="flex items-center gap-4 sm:gap-8 p-5 sm:p-8 rounded-4xl sm:rounded-[3rem] transition-all cursor-default border-2 border-transparent hover:border-blue-100"
                    >
                       <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0"><Zap size={22}/></div>
                       <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{t}</span>
                    </motion.div>
                  ))}
               </div>
               <MagneticButton>
                  <button className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600 flex items-center gap-4 group">
                    View Technical Roadmap <ArrowRight size={24} className="group-hover:translate-x-4 sm:group-hover:translate-x-6 transition-transform" />
                  </button>
               </MagneticButton>
            </div>
         </div>
      </section>
   )
}

const Footer = () => (
  <footer className="bg-slate-950 py-20 sm:py-28 md:py-40 rounded-t-[3rem] sm:rounded-t-[5rem] md:rounded-t-[7rem] overflow-hidden relative">
     <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-700 via-cyan-400 to-blue-700"></div>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-16 md:gap-32 items-center mb-16 sm:gap-y-12 sm:mb-24 md:mb-40">
        <div className="flex flex-col gap-6 sm:gap-10 md:gap-12">
           <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-4xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
                <img src="/databuddyLogo.png" alt="DataBuddy Logo" className="w-full h-full object-contain"/>
              </div>
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter">DataBuddy</span>
           </div>
           <p className="text-slate-400 text-base sm:text-xl md:text-2xl font-bold leading-relaxed">Forging the future of human-AI collaboration for global enterprise through robotic precision.</p>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
           <h4 className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm md:text-lg">Navigation</h4>
           <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-white text-lg sm:text-xl md:text-2xl font-black">
              <a href="#" className="hover:text-blue-400 transition-colors">Lab</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Manifesto</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Systems</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Network</a>
           </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 sm:col-span-2 md:col-span-1">
           <h4 className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm md:text-lg">Sync Status</h4>
           <div className="p-6 sm:p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] bg-white/5 border border-white/10 flex items-center gap-5 sm:gap-8">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.8)] flex-shrink-0"></div>
              <span className="text-white font-black text-base sm:text-xl md:text-2xl uppercase tracking-tighter">Systems Operational</span>
           </div>
        </div>
     </div>

     <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-20 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-12">
        <p className="text-slate-600 font-black text-xs sm:text-sm md:text-lg text-center sm:text-left">© 2026 DATABUDDY GLOBAL PROTOCOL. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 sm:gap-8 md:gap-12">
           {['In', 'Tw', 'Ig'].map(s => (
             <a key={s} href="#" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all font-black text-base sm:text-lg md:text-2xl">{s}</a>
           ))}
        </div>
     </div>
  </footer>
);

export default function App() {
  return (
    <>
      <style>{customStyles}</style>
      <div className="fluid-bg"></div>
      <div className="cyber-grid"></div>
      <div className="min-h-screen selection:bg-blue-600 selection:text-white">
        <Navbar />
        <HeroSection />
        
        <section id="services" className="py-20 sm:py-36 md:py-52">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-12 md:gap-16 mb-16 sm:gap-y-12 sm:mb-28 md:mb-40">
                <div className="max-w-3xl">
                   <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-4 sm:mb-8 md:mb-10 tracking-tighter">
                     High-Yield <span className="text-blue-600">Solutions.</span>
                   </h2>
                   <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-slate-500 font-bold leading-relaxed">
                     We deploy bespoke digital armaments designed to capture market share and dominate global landscapes at infinite scale.
                   </p>
                </div>
                <div className="flex gap-4 sm:gap-6 shrink-0">
                   <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl sm:rounded-[2.5rem] glass-card flex items-center justify-center text-blue-600 hover:bg-white transition-all"><ArrowRight size={24} className="rotate-180" /></div>
                   <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl sm:rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 hover:scale-110 transition-all"><ArrowRight size={24} /></div>
                </div>
             </div>
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-16">
               <ServiceCard icon={MonitorPlay} title="AI Motion" desc="Hyper-realistic animations and synthetic video generation for viral market penetration." delay={0.1} />
               <ServiceCard icon={Zap} title="Automation" desc="Fully autonomous business processes that eliminate all manual structural bottlenecks." delay={0.2} />
               <ServiceCard icon={Code2} title="Titan Web" desc="Architecting high-frequency websites with proprietary atomic design principles." delay={0.3} />
               <ServiceCard icon={TrendingUp} title="SEO Core" desc="Algorithmic dominance through deep-learning neural search optimization patterns." delay={0.4} />
               <ServiceCard icon={Megaphone} title="Sync Ads" desc="Multi-channel advertising campaigns synced via real-time predictive AI." delay={0.5} />
               <ServiceCard icon={Palette} title="Identity" desc="Brand systems that resonate with the collective digital consciousness." delay={0.6} />
             </div>
          </div>
        </section>

        <InteractiveShowcase />
        <EcosystemSection />
        
        <section id="contact" className="py-20 sm:py-36 md:py-60 px-4 sm:px-6">
           <div className="max-w-7xl mx-auto glass-card rounded-[3rem] sm:rounded-[5rem] md:rounded-[8rem] p-10 sm:p-16 md:p-28 lg:p-40 text-center relative overflow-hidden border-4 border-blue-50 shadow-2xl">
              <div className="absolute inset-0 opacity-10 cyber-grid"></div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                 <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 mb-8 sm:mb-12 md:mb-16 tracking-tighter leading-[0.85]">
                   Begin Your <br/> <span className="text-blue-600">Ascension.</span>
                 </h2>
                 <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-slate-500 font-bold mb-12 sm:mb-16 md:mb-24 max-w-3xl mx-auto leading-relaxed">
                   Connection established. Our engineers are ready to upgrade your business infrastructure to the next generation of intelligence.
                 </p>
                 <div className="flex flex-wrap justify-center gap-5 sm:gap-8 md:gap-12">
                    <MagneticButton>
                       <button className="px-8 sm:px-14 md:px-20 py-5 sm:py-7 md:py-10 bg-blue-600 text-white rounded-4xl sm:rounded-[2.5rem] md:rounded-[3.5rem] font-black text-xl sm:text-2xl md:text-4xl shadow-2xl shadow-blue-600/50 hover:bg-blue-700 transition-all">
                          Initiate Sync
                       </button>
                    </MagneticButton>
                    <MagneticButton>
                       <button className="px-8 sm:px-14 md:px-20 py-5 sm:py-7 md:py-10 glass-card text-slate-900 rounded-4xl sm:rounded-[2.5rem] md:rounded-[3.5rem] font-black text-xl sm:text-2xl md:text-4xl hover:bg-slate-50 transition-all border-4 border-slate-100">
                          Direct Feed
                       </button>
                    </MagneticButton>
                 </div>
              </motion.div>
           </div>
        </section>

        <Footer />
      </div>
    </>
  );
}