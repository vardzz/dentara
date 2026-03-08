'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Stethoscope, Users, CheckCircle2, BrainCircuit, AlertCircle, Loader2, GitMerge, ShieldCheck, ScanFace, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// --- Shared Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// --- Helper Functions and Components ---

function DentaraRadioGroup({ options, value, onChange, className }: { options: { label: string; value: string }[], value: string, onChange: (val: string) => void, className?: string }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn('flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 w-full', className)}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-3 cursor-pointer group min-h-[44px] py-2 px-1 w-full md:w-auto" onClick={() => onChange(option.value)}>
          <RadioGroupItem
            value={option.value}
            id={option.value}
            className={cn(
              "w-6 h-6 border-2 border-gray-300 transition-all duration-200 ease-in-out cursor-pointer shrink-0",
              "hover:border-brand-teal/50",
              "data-checked:!border-brand-teal data-checked:!bg-transparent",
              "[&_span[data-slot=radio-group-indicator]>span]:!bg-brand-teal [&_span[data-slot=radio-group-indicator]>span]:w-3 [&_span[data-slot=radio-group-indicator]>span]:h-3"
            )}
          />
          <Label htmlFor={option.value} className={cn("text-base font-semibold cursor-pointer transition-colors duration-200 min-h-[44px] flex items-center leading-tight flex-1 md:flex-auto", value === option.value ? "text-brand-dark" : "text-gray-500 group-hover:text-gray-700")}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

function EarlyAccessForm() {
  const [userType, setUserType] = useState<'student' | 'patient'>('student');
  const [email, setEmail] = useState('');

  const radioOptions = [
    { label: 'I need a patient (Student)', value: 'student' },
    { label: 'I need free care (Patient/LGU)', value: 'patient' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div variants={itemVariants} className="mb-6 w-full">
        <DentaraRadioGroup options={radioOptions} value={userType} onChange={(val) => setUserType(val as 'student' | 'patient')} className="justify-start md:justify-center" />
      </motion.div>
      <div className="w-full max-w-lg flex flex-col items-center">
        <motion.form
          variants={itemVariants}
          onSubmit={(e) => { e.preventDefault(); alert('Saved!'); }}
          className="flex w-full flex-col sm:flex-row gap-4 relative z-20 group"
        >
          <div className="flex-1 w-full relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'student' ? 'Enter your university email' : 'Enter your LGU or personal email'}
              required
              className="w-full min-h-[54px] bg-white border-gray-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal rounded-xl px-5 text-base text-gray-900 placeholder:text-gray-400 transition-all"
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto min-h-[54px] px-8 text-base text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] shadow-[0_4px_14px_0_rgba(59,130,246,0.3)]">
            Get Early Access <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.form>
        <motion.p variants={itemVariants} className="text-sm text-gray-500 mt-5 font-medium flex items-center gap-2 opacity-80 text-center">
          <span className="text-brand-teal">🎉</span> Limited beta slots <ArrowRight className="w-4 h-4 text-brand-teal/60" /> reserve your spot now.
        </motion.p>
      </div>
    </div>
  );
}

function AiTriageDemo() {
  const [symptom, setSymptom] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptom.trim()) return;
    setIsAnalyzing(true);
    setAiResult(null);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setAiResult("Predicted Requirement: Extraction. The context implies a severe case suitable for clinical quotas.");
    } catch {
      setError('Error parsing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.section variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#0a1f44] text-white relative overflow-hidden border-y border-brand-teal/20 w-full flex flex-col">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>
      <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-10 md:gap-16 items-center lg:items-start text-left">
        {/* Adaptive: max-w-xl ensures text readability measure on massive ultra-wide monitors */}
        <div className="w-full lg:flex-1 lg:max-w-xl flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-sm font-semibold text-brand-light mb-6 tracking-wide uppercase">Live Demo</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Try the AI Digital Triage</h2>
          <p className="text-blue-200/80 text-base md:text-xl leading-relaxed mb-8">See how Dentara&apos;s algorithm bridges the gap between everyday patient complaints and strict academic graduation requirements in real-time.</p>
          <ul className="space-y-4 text-base md:text-lg text-blue-100 flex flex-col items-start w-full">
            <li className="flex items-start md:items-center gap-3"><CheckCircle2 className="w-6 h-6 text-brand-teal shrink-0 mt-0.5 md:mt-0" /> <span className="flex-1">Translates Tagalog/English symptoms perfectly</span></li>
            <li className="flex items-start md:items-center gap-3"><CheckCircle2 className="w-6 h-6 text-brand-teal shrink-0 mt-0.5 md:mt-0" /> <span className="flex-1">Identifies specific clinical quotas for universities</span></li>
            <li className="flex items-start md:items-center gap-3"><CheckCircle2 className="w-6 h-6 text-brand-teal shrink-0 mt-0.5 md:mt-0" /> <span className="flex-1">Eliminates manual case screening bottlenecks</span></li>
          </ul>
        </div>
        {/* Adaptive: desktop card hover shadow */}
        <Card className="w-full lg:flex-1 bg-white/5 border-white/10 backdrop-blur-md shadow-2xl border transition-all duration-500 lg:hover:shadow-brand-teal/20">
          <CardContent className="p-6 md:p-8 flex flex-col">
            <label htmlFor="symptom" className="text-base font-medium text-blue-200 mb-4 block">Patient&apos;s Complaint (Try typing in Tagalog!)</label>
            <textarea id="symptom" rows={4} value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="e.g., 'Masakit po yung bagang ko...'" className="w-full min-h-[100px] bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-base text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all mb-6 resize-none" />
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full min-h-[60px] text-base md:text-lg bg-brand-teal hover:bg-[#107a82] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center">
              {isAnalyzing ? <><Loader2 className="animate-spin mr-3 h-6 w-6" /> Analyzing Case...</> : '✨ Analyze Case Requirement'}
            </Button>
            <AnimatePresence mode="wait">
              {(aiResult || isAnalyzing || error) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden w-full">
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#0e2b5c]/50 border border-brand-teal/30 flex flex-col">
                    {isAnalyzing ? (
                      <div className="space-y-4"><Skeleton className="h-5 w-3/4 bg-brand-teal/20" /><Skeleton className="h-5 w-1/2 bg-brand-teal/20" /></div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0 border border-brand-teal/50"><BrainCircuit className="w-6 h-6 text-brand-teal" /></div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-brand-teal uppercase tracking-wider mb-2">Quota Match Identified</p>
                          <p className="text-blue-50 text-base md:text-lg leading-relaxed font-medium">{aiResult}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}

function FeaturesGrid() {
  const FEATURES = [
    { icon: <GitMerge className="w-7 h-7" />, title: 'Smart Quota Matching', desc: 'Stop hunting blindly on Facebook. Our algorithm pairs your specific syllabus requirements directly with patients needing that exact procedure.' },
    { icon: <ShieldCheck className="w-7 h-7" />, title: 'Verified Attendance', desc: "Say goodbye to wasted allowance and ghosting. We partner directly with LGUs to batch-schedule patients, ensuring near-100% attendance." },
    { icon: <ScanFace className="w-7 h-7" />, title: 'Digital Triage', desc: 'Patients are pre-screened via photo uploads before they even step into the clinic. Never waste precious clinical hours diagnosing the wrong case.' },
    { icon: <LayoutDashboard className="w-7 h-7" />, title: 'Institutional Dashboard', desc: 'Stay perfectly in the loop. Manage your waivers, track your completed cases, and get immediate faculty oversight and approvals.' }
  ];
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-brand-light/30 relative flex flex-col items-center w-full">
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="w-full max-w-7xl flex flex-col relative z-10 text-center md:text-left">
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-center">
          <span className="text-gradient">Your path</span> to <span className="text-gradient">licensure</span> starts here
        </motion.h2>
        <motion.p variants={itemVariants} className="text-brand-gray max-w-3xl mx-auto mb-16 text-lg md:text-xl lg:text-2xl text-center leading-relaxed">
          Dentara brings together clinical requirements, verified patients, and university oversight—so you fulfill your quotas faster.
        </motion.p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {FEATURES.map((feat, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-[2rem] border border-brand-teal/10 shadow-[0_4px_20px_-4px_rgba(19,139,148,0.08)] flex flex-col gap-4 group transition-all duration-300 w-full text-left md:hover:-translate-y-2 md:hover:shadow-xl lg:hover:shadow-2xl cursor-pointer pointer-events-auto">
              <div className="w-16 h-16 bg-brand-light text-brand-teal rounded-2xl flex items-center justify-center shrink-0 mb-3 group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">{feat.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-dark transition-colors">{feat.title}</h3>
              <p className="text-brand-gray text-base md:text-lg leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function VisionMission() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#f0f7f9] to-white relative flex flex-col items-center w-full">
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="w-full max-w-7xl flex flex-col relative z-10">
        <motion.div variants={itemVariants} className="mb-24 flex flex-col text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-[#1e293b]">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-[#3b82f6]">Vision</span></h2>
          <p className="text-xl md:text-3xl lg:text-4xl text-[#475569] max-w-5xl mx-auto leading-relaxed md:leading-normal">
            Become the Philippines&apos; most trusted clinical supply chain platform—where <span className="font-semibold italic text-[#1e293b]">every student</span> graduates on time, and <span className="font-semibold text-[#1e293b]">every community</span> receives the oral care they deserve.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 tracking-tight text-center md:text-left text-[#1e293b]">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-brand-teal">Mission</span></h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[
              { num: '1', title: 'Industrialize procurement', desc: 'Replace chaotic Facebook hunting with a safe, verified pipeline for clinical cases.' },
              { num: '2', title: 'Champion public health', desc: 'Connect the 92% of Filipinos suffering from untreated decay directly to free treatment.' },
              { num: '3', title: 'Unlock on-time licensure', desc: 'Turn clinical requirements back into an educational milestone rather than a burden.' }
            ].map(m => (
              <div key={m.num} className="bg-[#f8fafc] p-8 md:p-10 rounded-3xl border border-transparent shadow-sm flex flex-col min-h-[220px] md:min-h-[260px] relative overflow-hidden group transition-all duration-300 md:hover:-translate-y-2 lg:hover:shadow-xl lg:hover:border-brand-teal/30 cursor-pointer pointer-events-auto">
                <div className="relative z-10 flex flex-col gap-3">
                  <h3 className="font-bold text-[#1e293b] text-xl md:text-2xl pr-12 group-hover:text-brand-teal transition-colors duration-300">{m.title}</h3>
                  <p className="text-[#475569] text-base md:text-lg leading-relaxed">{m.desc}</p>
                </div>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 font-black text-[10rem] md:text-[14rem] text-[#e2e8f0] opacity-60 leading-none select-none pointer-events-none group-hover:text-brand-teal/10 transition-colors duration-500">{m.num}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// --- Main Page Export ---

export default function Home() {
  const [stats, setStats] = useState({ clinicians: 0, lgus: 0 });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let currentClinicians = 0; let currentLgus = 0;
        const interval = setInterval(() => {
          let d = true;
          if (currentClinicians < 642) { currentClinicians = Math.min(642, currentClinicians + Math.ceil(642 / 25)); d = false; }
          if (currentLgus < 28) { currentLgus = Math.min(28, currentLgus + Math.ceil(28 / 25)); d = false; }
          setStats({ clinicians: currentClinicians, lgus: currentLgus });
          if (d) clearInterval(interval);
        }, 40);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main id="home" className="relative pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center bg-gradient-to-b from-brand-light/40 to-white overflow-hidden w-full">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm md:text-base font-medium text-gray-700 mb-8 md:mb-10">
            <span>🇵🇭</span> Tackling the PH Dental Quota Crisis
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 md:mb-8 leading-[1.1] w-full">
            Where <span className="text-gradient">Care</span> Meets <span className="text-gradient">Career!</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-lg md:text-xl lg:text-2xl text-brand-gray mb-10 md:mb-14 max-w-3xl leading-relaxed w-full">
            Graduate on time, not by chance. We match dentistry students with pre-screened patients needing specific procedures, eliminating delays.
          </motion.p>

          <div className="w-full flex flex-col items-center">
            <EarlyAccessForm />
          </div>

          <motion.div ref={statsRef} variants={itemVariants} className="mt-16 md:mt-24 w-full flex flex-col items-center">
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-5">Join the waitlist with:</p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-6 justify-center">
              <div className="w-full sm:w-auto bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-5 flex items-center gap-5 shadow-sm transition-transform duration-300 md:hover:-translate-y-1.5 md:hover:shadow-md cursor-pointer group">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="text-left flex flex-col">
                  <p className="text-3xl md:text-4xl font-black text-gray-900 leading-none mb-1">{stats.clinicians}</p>
                  <p className="text-sm md:text-base text-brand-gray font-semibold">Clinicians waiting</p>
                </div>
              </div>
              <div className="w-full sm:w-auto bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-5 flex items-center gap-5 shadow-sm transition-transform duration-300 md:hover:-translate-y-1.5 md:hover:shadow-md cursor-pointer group">
                <div className="w-14 h-14 bg-teal-100 text-brand-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">
                  <Users className="w-7 h-7" />
                </div>
                <div className="text-left flex flex-col">
                  <p className="text-3xl md:text-4xl font-black text-gray-900 leading-none mb-1">{stats.lgus}</p>
                  <p className="text-sm md:text-base text-brand-gray font-semibold">LGUs / Partners ready</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <AiTriageDemo />
      <FeaturesGrid />
      <VisionMission />
    </div>
  );
}
