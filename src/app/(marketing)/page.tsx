'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu, X, ArrowRight, PlayCircle, ScanFace, Activity, Check, GitMerge,
  BrainCircuit, ShieldCheck, LayoutDashboard, Users, Building, AlertTriangle,
  CheckCircle, ListTodo, Bot, CalendarCheck, Sparkles, Loader2, AlertCircle,
  ChevronDown, Facebook, Twitter, Instagram, Linkedin,
} from 'lucide-react';
import Footer from '@/components/custom/footer';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation variant presets
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function App() {
  const shouldReduceMotion = useReducedMotion();

  // Navigation States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Scroll lock effect
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // AI Demo States
  const [symptom, setSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Waitlist States
  const [heroWaitlisted, setHeroWaitlisted] = useState(false);
  const [ctaWaitlisted, setCtaWaitlisted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      q: "How does Dentara prevent patient 'ghosting'?",
      a: "Unlike informal Facebook groups, Dentara partners directly with Local Government Units (LGUs) and Barangay Health Workers. Patients are batch-scheduled and vetted by community leaders, creating social accountability that virtually eliminates no-shows on clinic day.",
    },
    {
      q: 'Is this system approved by dental universities?',
      a: 'Yes! Dentara is a B2B platform designed specifically for institutional use. Clinical coordinators have a dedicated dashboard to track student quotas, oversee matching safety, and manage liability waivers, ensuring full academic and legal compliance.',
    },
    {
      q: 'Do patients have to pay for the platform?',
      a: 'Absolutely not. Dentara is entirely free for patients. Our goal is to connect indigent communities with the free, supervised oral healthcare provided by clinical students, addressing the 92% of Filipinos with untreated decay.',
    },
    {
      q: 'How accurate is the AI Digital Triage?',
      a: 'The AI (powered by Google Gemini) acts as an initial filter, translating colloquial symptoms (Tagalog/English) into probable academic requirements. It drastically reduces obvious mismatches, though final clinical diagnosis is always verified by the student and supervising faculty in the clinic.',
    },
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleHeroWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroWaitlisted(true);
  };

  const handleCtaWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setCtaWaitlisted(true);
  };

  const analyzeSymptoms = async () => {
    if (!symptom.trim()) {
      setAiError('Please enter a patient symptom before analyzing.');
      return;
    }
    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);

    const apiKey = ''; // Provided by execution environment

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: symptom }] }],
            systemInstruction: {
              parts: [
                {
                  text: "You are an intelligent dental triage assistant for Dentara. The user will input a patient's dental symptom or complaint, often in Tagalog. Your task is to identify the most likely simple care category that a dentistry student could help with (e.g., Tooth Filling, Tooth Removal, Tooth Replacement). Format your response strictly in two short sentences: The first sentence must state the predicted care category. The second sentence must briefly explain why based on the symptom.",
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Unable to analyze symptom at this time.';
      setAiResult(aiText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setAiError('System error. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#fafcff] text-gray-800 antialiased selection:bg-[#138b94] selection:text-white flex flex-col min-h-screen overflow-x-hidden font-sans">
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .text-gradient {
          background: linear-gradient(90deg, #0e2b5c 0%, #138b94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Navigation                                                        */}
      {/* ---------------------------------------------------------------- */}
      <nav
        className={`w-full fixed top-0 z-[60] transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 shadow-sm backdrop-blur-md border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <img
              src="/assets/icon.png"
              alt="Dentara Icon"
              className="w-8 h-8 object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <span className="text-xl font-bold tracking-tight text-[#0e2b5c]">
              DENTARA
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#138b94] transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-[#138b94] transition-colors duration-200">How it Works</a>
            <a href="#demo" className="hover:text-[#138b94] transition-colors duration-200">AI Demo</a>
            <a href="#faq" className="hover:text-[#138b94] transition-colors duration-200">FAQ</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/app/login" className="text-sm font-semibold text-[#0e2b5c] hover:text-[#3b82f6] transition-colors duration-200">
              Log In
            </a>
            <a
              href="/app/register"
              className="bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile Focused Sidebar                                             */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] md:hidden"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-[80] md:hidden shadow-2xl flex flex-col"
            >
              {/* Top Header */}
              <div className="h-20 flex items-center justify-between px-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/icon.png"
                    alt="Dentara Icon"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-bold tracking-tight text-[#0e2b5c]">
                    DENTARA
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#0e2b5c] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="flex flex-col gap-2 p-8"
              >
                {[
                  { name: 'Features', href: '#features' },
                  { name: 'How it Works', href: '#how-it-works' },
                  { name: 'AI Demo', href: '#demo' },
                  { name: 'FAQ', href: '#faq' },
                ].map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="text-2xl font-bold text-[#0e2b5c] hover:text-[#138b94] transition-colors py-2"
                  >
                    {link.name}
                  </motion.a>
                ))}

                <div className="h-px bg-gray-100 my-6" />

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col gap-4"
                >
                  <a
                    href="/app/login"
                    className="flex items-center justify-center py-4 rounded-xl border border-gray-200 text-[#0e2b5c] font-bold hover:bg-gray-50 transition-all"
                  >
                    Log In
                  </a>
                  <a
                    href="/app/register"
                    className="flex items-center justify-center py-4 rounded-xl bg-[#3b82f6] text-white font-bold shadow-lg hover:bg-blue-600 transition-all"
                  >
                    Join Waitlist
                  </a>
                </motion.div>
              </motion.div>

              {/* Bottom Brand */}
              <div className="mt-auto p-8 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                  Dentara © 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------- */}
      {/* Hero Section                                                      */}
      {/* ---------------------------------------------------------------- */}
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Text content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left z-10"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-semibold text-gray-600 mb-6 uppercase tracking-wider">
            <span className="text-lg leading-none">🇵🇭</span> Tackling the PH Dental Quota Crisis
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0e2b5c] mb-6 leading-[1.15]"
          >
            Turn Clinical <br className="hidden lg:block" />{' '}
            <span className="text-gradient">Quotas</span> Into{' '}
            <br className="hidden lg:block" /> Graduations
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Dentara is a B2B2C clinical requirement platform connecting dentistry
            students with pre-screened indigent patients. Secure your cases,
            eliminate &ldquo;ghosting&rdquo;, and graduate on time.
          </motion.p>

          <motion.div variants={fadeUp}>
            {!heroWaitlisted ? (
              <form
                onSubmit={handleHeroWaitlist}
                className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start w-full max-w-md mx-auto lg:mx-0"
              >
                <input
                  type="email"
                  placeholder="Enter your .edu email"
                  required
                  className="w-full sm:flex-1 px-4 py-3.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-[0_10px_15px_-3px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Start Matching <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-green-50 text-green-700 px-6 py-4 rounded-xl border border-green-200 max-w-md mx-auto lg:mx-0">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">You&apos;re on the list! We&apos;ll notify you soon.</span>
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex items-center justify-center lg:justify-start gap-4">
            <a
              href="#demo"
              className="text-[#475569] font-medium text-sm hover:text-[#138b94] transition-colors duration-200 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-[#138b94]" /> Try AI Triage Demo
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-gray-400 mt-6 font-medium">
            Trusted by clinical coordinators in Metro Manila.
          </motion.p>
        </motion.div>

        {/* Floating UI Mockup */}
        <div className="flex-1 w-full max-w-lg relative z-10 hidden md:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#138b94]/20 to-[#3b82f6]/20 rounded-full blur-[80px] -z-10 pointer-events-none" />

          <motion.div
            animate={shouldReduceMotion ? {} : floatAnimation}
            className="bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(14,43,92,0.15)] border border-gray-100 p-6 relative overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 text-xs font-medium text-gray-400">Dentara Student Dashboard</div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#0e2b5c]">Pending Quotas</h3>
                <span className="text-xs bg-blue-100 text-[#3b82f6] px-2 py-1 rounded-md font-bold">
                  2/5 Completed
                </span>
              </div>

              <div className="bg-[#f0f7f9]/50 border border-[#138b94]/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#138b94]">
                    <ScanFace className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Tooth Filling</p>
                    <p className="text-xs text-[#138b94] font-medium">1 Patient Matched ✨</p>
                  </div>
                </div>
                <button className="bg-[#0e2b5c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 ease-in-out hover:bg-[#0a1f45]">
                  Claim
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Tooth Removal</p>
                    <p className="text-xs text-gray-400 font-medium">Scanning network...</p>
                  </div>
                </div>
                <button disabled className="bg-gray-200 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg">
                  Wait
                </button>
              </div>
            </div>

            {/* Badge */}
            <div
              className="absolute -right-4 bottom-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3"
              style={{ animation: 'bounce 3s infinite' }}
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Attendance Confirmed</p>
                <p className="text-[10px] text-gray-500">LGU Batch Schedule</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* 4 Ways / Features                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section id="features" className="py-20 px-6 md:px-12 lg:px-24 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#0e2b5c] mb-4">
              4 Ways We Secure Your <span className="text-[#3b82f6]">Licensure</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We industrialize the clinical supply chain, turning the stressful hunt for patients into a structured, reliable process.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <GitMerge className="w-6 h-6" />,
                title: 'Smart Quota Matching',
                desc: 'Our algorithm pairs your specific syllabus requirements directly with patients needing that exact procedure.',
                color: 'bg-[#f0f7f9] text-[#138b94]',
              },
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                title: 'AI Digital Triage',
                desc: 'Patients are pre-screened via text and photos before stepping into the clinic, preventing case mismatches.',
                color: 'bg-blue-50 text-[#3b82f6]',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: 'Verified Attendance',
                desc: 'We partner with LGUs to batch-schedule patients, using community oversight to virtually eliminate ghosting.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: <LayoutDashboard className="w-6 h-6" />,
                title: 'Institutional Tracking',
                desc: 'Universities gain a dashboard to oversee safety, manage waivers, and track overall student throughput.',
                color: 'bg-purple-50 text-purple-600',
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white p-7 rounded-2xl border border-gray-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-1.5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feat.color}`}>
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-gray-100 bg-[#fafcff]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-wrap justify-between items-center gap-8 text-center divide-x-0 md:divide-x divide-gray-200"
          >
            {[
              { icon: <Users className="w-4 h-4" />, label: 'TAM', val: '6,200+', desc: 'Clinical Students', textCol: 'text-[#3b82f6]' },
              { icon: <Building className="w-4 h-4" />, label: 'Network', val: '31', desc: 'Accredited Schools', textCol: 'text-[#138b94]' },
              { icon: <AlertTriangle className="w-4 h-4" />, label: 'Demand', val: '92%', desc: 'PH Untreated Decay', textCol: 'text-red-400' },
              { icon: <CheckCircle className="w-4 h-4" />, label: 'Goal', val: '100%', desc: 'Verified Matches', textCol: 'text-green-500' },
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="flex-1 min-w-[150px]">
                <div className={`flex items-center justify-center gap-2 mb-1 ${stat.textCol}`}>
                  {stat.icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-3xl font-extrabold text-[#0e2b5c]">{stat.val}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it Works                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section id="how-it-works" className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-[#0e2b5c] mb-4">
              Launch in <span className="text-[#3b82f6]">3 Simple Steps</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16">
              No more stress. No more &ldquo;Looking for patient&rdquo; Facebook posts. Just a streamlined
              path to completing your clinical requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100 -z-10" />

            {[
              { step: 1, icon: <ListTodo className="w-10 h-10 stroke-[1.5]" />, title: 'Input Your Quotas', desc: 'Log into the student dashboard and list your exact syllabus requirements for the semester.', col: 'text-[#0e2b5c]' },
              { step: 2, icon: <Bot className="w-10 h-10 stroke-[1.5]" />, title: 'AI Pre-Screens Patients', desc: 'Patients via LGU submit their symptoms. Our AI translates local complaints into academic case tags.', col: 'text-[#138b94]' },
              { step: 3, icon: <CalendarCheck className="w-10 h-10 stroke-[1.5]" />, title: 'Match & Treat', desc: 'Accept a verified match, digitally sign liability waivers, and treat the patient securely in the clinic.', col: 'text-[#3b82f6]' },
            ].map((s) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 bg-white px-2">
                  Step {s.step}
                </span>
                <div className={`w-24 h-24 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 ${s.col}`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0e2b5c] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AI Demo                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="demo" className="py-28 px-6 md:px-12 lg:px-24 bg-[#f0f7f9]/30 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-[#0e2b5c] mb-4">
              See <span className="text-[#138b94]">Dentara AI</span> in Action
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Test our MVP Digital Triage system right here. Type a patient&apos;s complaint in Tagalog,
              and watch the LLM identify the specific clinical quota needed.
            </p>
          </motion.div>

          <div className="bg-[#0e2b5c] rounded-2xl shadow-2xl overflow-hidden border border-[#0e2b5c]/20 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-black/20 p-6 hidden md:block">
              <div className="flex items-center gap-2 text-white mb-8 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded-lg flex items-center px-4">
                  <span className="text-xs text-white/70 font-medium">Dashboard</span>
                </div>
                <div className="h-8 bg-[#138b94]/30 border border-[#138b94]/50 rounded-lg flex items-center px-4">
                  <span className="text-xs text-[#138b94] font-bold">AI Triage (Active)</span>
                </div>
                <div className="h-8 bg-white/5 rounded-lg flex items-center px-4">
                  <span className="text-xs text-white/50">My Quotas</span>
                </div>
                <div className="h-8 bg-white/5 rounded-lg flex items-center px-4">
                  <span className="text-xs text-white/50">Waivers</span>
                </div>
              </div>
            </div>

            {/* Main panel */}
            <div className="flex-1 p-6 md:p-10 bg-white/5 relative">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />

              <div className="relative z-10 max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <label htmlFor="symptomInput" className="block text-sm font-bold text-[#0e2b5c] mb-2">
                    Patient Intake Form (Try in Tagalog!)
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    Simulate a patient entering their main complaint via the LGU portal.
                  </p>

                  <textarea
                    id="symptomInput"
                    rows={3}
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="e.g., 'Masakit po yung bagang ko pag umiinom ng malamig, parang may butas na malalim.'"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#138b94] focus:border-[#138b94] transition-all duration-200 mb-4 resize-none"
                  />

                  <AnimatePresence>
                    {aiError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex gap-2 items-center text-red-500 text-sm font-medium mb-4 bg-red-50 p-3 rounded-lg border border-red-100"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <p>{aiError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={analyzeSymptoms}
                    disabled={isAnalyzing}
                    className="w-full bg-[#138b94] hover:bg-[#107a82] text-white font-bold py-3.5 rounded-lg shadow-md transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Identify Clinical Requirement</>
                    )}
                  </button>

                  <AnimatePresence>
                    {aiResult && (
                      <motion.div
                        key="ai-result"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                        className="mt-4 p-4 rounded-lg bg-[#f0f7f9] border border-[#138b94]/20"
                      >
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full bg-[#138b94]/10 flex items-center justify-center shrink-0 border border-[#138b94]/30">
                            <BrainCircuit className="w-4 h-4 text-[#138b94]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wider mb-1">
                              Quota Match Identified
                            </p>
                            <p className="text-[#0e2b5c] text-sm leading-relaxed font-medium">{aiResult}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Check className="w-4 h-4 text-[#3b82f6]" /> LLM Powered (Gemini)
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Check className="w-4 h-4 text-[#3b82f6]" /> No Manual Screening
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Check className="w-4 h-4 text-[#3b82f6]" /> Instant Tagging
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ with AnimatePresence accordion                                */}
      {/* ---------------------------------------------------------------- */}
      <section id="faq" className="py-28 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-[#0e2b5c] mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about how Dentara works.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50/80 transition-colors duration-200 focus:outline-none"
                >
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaqIndex === index && (
                    <motion.div
                      key="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28, opacity: { duration: 0.22 } }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-4 text-gray-500 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Bottom CTA                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section id="cta" className="py-28 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0e2b5c] mb-4">
              Ready to Complete Your Quotas?
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              Join Dentara to explore our network of pre-screened patients, structured LGU partnerships,
              and seamless institutional tracking. Start graduating on time.
            </p>

            {!ctaWaitlisted ? (
              <form
                onSubmit={handleCtaWaitlist}
                className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your .edu email"
                  required
                  className="flex-1 px-4 py-3.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Start Matching <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-4 rounded-xl border border-green-200 max-w-md mx-auto">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Successfully joined the waitlist!</span>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4">
              For university administrators, please contact us for a pilot demo.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
