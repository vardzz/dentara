'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Stethoscope,
  Users,
  CheckCircle2,
  GitMerge,
  ShieldCheck,
  ScanFace,
  LayoutDashboard,
  BrainCircuit,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [userType, setUserType] = useState<'student' | 'patient'>('student');
  const [email, setEmail] = useState('');
  const [symptom, setSymptom] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ clinicians: 0, lgus: 0 });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = { clinicians: 642, lgus: 28 };
    const speed = 25;

    let currentClinicians = 0;
    let currentLgus = 0;

    const interval = setInterval(() => {
      let done = true;
      if (currentClinicians < targets.clinicians) {
        currentClinicians = Math.min(targets.clinicians, currentClinicians + Math.ceil(targets.clinicians / speed));
        done = false;
      }
      if (currentLgus < targets.lgus) {
        currentLgus = Math.min(targets.lgus, currentLgus + Math.ceil(targets.lgus / speed));
        done = false;
      }

      setStats({ clinicians: currentClinicians, lgus: currentLgus });

      if (done) clearInterval(interval);
    }, 40);
  };

  const handleAnalyze = async () => {
    if (!symptom.trim()) {
      alert("Mangyaring ilagay ang sintomas ng pasyente bago i-analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);
    setError(null);

    try {
      // In a real app, this would be a server action or API route
      // For this migration, we'll simulate the response or use the logic provided
      // Note: The user mentioned a provided API key but we don't have it here.
      // We'll provide a mock response that matches the character of the original.

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Example analysis based on common symptoms
      let mockResult = "Predicted Requirement: Class II Composite Restoration. The patient's sensitivity to cold and deep decay indicates a need for a multi-surface filling to restore function and prevent further infection.";

      if (symptom.toLowerCase().includes('bunot') || symptom.toLowerCase().includes('tanggal')) {
        mockResult = "Predicted Requirement: Simple Extraction. The patient mentions a desire for removal which, combined with the reported pain, typically points to a non-savable tooth requiring extraction.";
      } else if (symptom.toLowerCase().includes('pustiso')) {
        mockResult = "Predicted Requirement: Removable Partial Denture. The clinical context of missing teeth suggests a prosthetic requirement to restore aesthetics and masticatory efficiency.";
      }

      setAiResult(mockResult);
    } catch (err) {
      setError("May naganap na error sa system. Pakisubukan muli maya-maya.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <main id="home" className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center bg-gradient-to-b from-brand-light/40 to-white overflow-hidden">
        {/* Background aesthetic blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light rounded-full blur-[100px] opacity-70 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-light/60 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600 mb-8">
            <span>🇵🇭</span> Tackling the PH Dental Quota Crisis
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Where <span className="text-gradient">Care</span> Meets <span className="text-gradient">Career!</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-gray mb-10 max-w-2xl leading-relaxed">
            Graduate on time, not by chance. We match dentistry students with pre-screened patients needing specific procedures, eliminating &quot;ghosting&quot; and delays.
          </p>

          {/* Selection Options */}
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={() => setUserType('student')}
                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 focus:outline-none transition-all"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-teal opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-brand-dark transition-colors">I need a patient (Student)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="userType"
                  value="patient"
                  checked={userType === 'patient'}
                  onChange={() => setUserType('patient')}
                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 focus:outline-none transition-all"
                />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-teal opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-brand-dark transition-colors">I need free care (Patient/LGU)</span>
            </label>
          </div>

          {/* Email Capture */}
          <form
            onSubmit={(e) => { e.preventDefault(); alert('Thanks for joining the waitlist! We will notify you when we launch in your university/LGU.'); }}
            className="flex w-full max-w-md flex-col sm:flex-row gap-3 relative z-20"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'student' ? "Enter your university email" : "Enter your LGU or personal email"}
              required
              className="flex-1 px-4 py-3.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-brand-teal focus:border-brand-teal outline-none transition-shadow text-gray-800 placeholder-gray-400"
            />
            <button type="submit" className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              Get Early Access <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3 font-medium flex items-center gap-1">
            🎉 Limited beta slots <ArrowRight className="w-3 h-3 inline" /> reserve your spot now.
          </p>

          {/* Waitlist Stats */}
          <div ref={statsRef} className="mt-16 w-full flex flex-col items-center">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Join the waitlist with:</p>
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900 leading-none">{stats.clinicians}</p>
                  <p className="text-xs text-brand-gray font-medium mt-1">Clinicians waiting</p>
                </div>
              </div>

              <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 bg-teal-100 text-brand-teal rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-900 leading-none">{stats.lgus}</p>
                  <p className="text-xs text-brand-gray font-medium mt-1">LGUs / Partners ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive AI Triage Demo Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#0a1f44] text-white relative overflow-hidden border-y border-brand-teal/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-xs font-semibold text-brand-light mb-4 tracking-wide uppercase">
              Live Demo
            </div>
            <h2 className="text-3xl font-bold mb-4">Try the AI Digital Triage</h2>
            <p className="text-blue-200/80 text-sm leading-relaxed mb-6">
              See how Dentara&apos;s algorithm bridges the gap between everyday patient complaints and strict academic graduation requirements in real-time.
            </p>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal" /> Translates Tagalog/English symptoms</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal" /> Identifies specific clinical quotas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-teal" /> Eliminates manual case screening</li>
            </ul>
          </div>

          {/* AI Demo Interface */}
          <div className="flex-1 w-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-2xl">
            <label htmlFor="symptomInput" className="block text-sm font-medium text-blue-200 mb-2">Patient&apos;s Complaint (Try typing in Tagalog!)</label>
            <textarea
              id="symptomInput"
              rows={3}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="e.g., 'Masakit po yung bagang ko pag umiinom ng malamig, parang may butas na malalim.'"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all mb-4 resize-none"
            ></textarea>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-brand-teal hover:bg-[#107a82] text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" />
                  Analyzing...
                </>
              ) : (
                '✨ Analyze Case Requirement'
              )}
            </button>

            {/* AI Result Box */}
            {(aiResult || isAnalyzing || error) && (
              <div className="mt-4 p-4 rounded-xl bg-[#0e2b5c]/50 border border-brand-teal/30 min-h-[80px]">
                {isAnalyzing ? (
                  <p className="text-brand-teal animate-pulse text-sm font-medium">✨ Tinutukoy ang clinical requirement para sa estudyante...</p>
                ) : error ? (
                  <div className="flex gap-3 items-center text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0 border border-brand-teal/50">
                      <BrainCircuit className="w-5 h-5 text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">Quota Match Identified</p>
                      <p className="text-blue-50 text-sm leading-relaxed">{aiResult}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-white to-brand-light/30 relative">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-light/70 rounded-full blur-[120px] opacity-50 pointer-events-none translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"><span className="text-gradient">Your path</span> to <span className="text-gradient">licensure</span> starts here</h2>
          <p className="text-brand-gray max-w-3xl mx-auto mb-16 text-lg">
            Dentara brings together clinical requirements, verified patients, and university oversight—so you fulfill your quotas faster through smart matching and reliable attendance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-left">
            <FeatureCard
              icon={<GitMerge className="w-6 h-6" />}
              title="Smart Quota Matching"
              description="Stop hunting blindly on Facebook. Our algorithm pairs your specific syllabus requirements (e.g., Class II Molar) directly with patients needing that exact procedure."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Verified Attendance"
              description={`Say goodbye to wasted allowance and "ghosting". We partner directly with LGUs to batch-schedule patients, ensuring peer-pressured, near-100% attendance on clinic day.`}
            />
            <FeatureCard
              icon={<ScanFace className="w-6 h-6" />}
              title="Digital Triage"
              description="Patients are pre-screened via photo uploads before they even step into the clinic. Never waste precious clinical hours diagnosing the wrong case type again."
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="Institutional Dashboard"
              description="Stay perfectly in the loop. Manage your waivers, track your completed cases, and get immediate faculty oversight and approvals all within one secure app."
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#f0f7f9] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-light/40 rounded-full blur-[100px] opacity-40 pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-brand-light/60 rounded-full blur-[100px] opacity-50 pointer-events-none -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-[#1e293b]">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-[#3b82f6]">Vision</span></h2>
            <p className="text-lg text-[#475569] max-w-4xl mx-auto leading-relaxed">
              Become the Philippines&apos; most trusted clinical supply chain platform—where <span className="font-semibold italic text-[#1e293b]">every student</span> graduates on time, and <span className="font-semibold text-[#1e293b]">every community</span> receives the oral care they deserve.
            </p>
          </div>

          <div className="mb-12 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight text-[#1e293b]">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-brand-teal">Mission</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
              <MissionCard
                number="1"
                title="Industrialize procurement"
                description="Replace chaotic, stressful Facebook hunting with a safe, verified pipeline for clinical cases."
                borderColor="hover:border-brand-teal/10"
                shadowColor="hover:shadow-[0_20px_40px_-10px_rgba(19,139,148,0.15)]"
                titleHoverColor="group-hover:text-brand-teal"
              />
              <MissionCard
                number="2"
                title="Champion public health"
                description="Connect the 92% of Filipinos suffering from untreated decay directly to free, supervised treatment."
                borderColor="hover:border-[#3b82f6]/10"
                shadowColor="hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)]"
                titleHoverColor="group-hover:text-[#3b82f6]"
              />
              <MissionCard
                number="3"
                title="Unlock on-time licensure"
                description="Turn clinical requirements back into an educational milestone rather than a financial and logistical burden."
                borderColor="hover:border-brand-dark/10"
                shadowColor="hover:shadow-[0_20px_40px_-10px_rgba(14,43,92,0.15)]"
                titleHoverColor="group-hover:text-brand-dark"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-brand-teal/10 shadow-[0_4px_20px_-4px_rgba(19,139,148,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(19,139,148,0.15)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
      <div className="w-12 h-12 bg-brand-light text-brand-teal rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-dark transition-colors">{title}</h3>
      <p className="text-brand-gray leading-relaxed">{description}</p>
    </div>
  );
}

function MissionCard({ number, title, description, borderColor, shadowColor, titleHoverColor }: {
  number: string,
  title: string,
  description: string,
  borderColor: string,
  shadowColor: string,
  titleHoverColor: string
}) {
  return (
    <div className={`group bg-[#f8fafc] p-8 rounded-2xl border border-transparent ${borderColor} shadow-sm ${shadowColor} hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-center min-h-[180px]`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
      <div className="relative z-10">
        <h3 className={`font-bold text-[#1e293b] text-xl mb-3 pr-10 ${titleHoverColor} transition-colors duration-300`}>{title}</h3>
        <p className="text-[#475569] leading-relaxed text-sm pr-6">{description}</p>
      </div>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 font-black text-[12rem] text-[#e2e8f0] opacity-60 group-hover:text-brand-light/80 transition-colors duration-500 leading-none select-none pointer-events-none">{number}</span>
    </div>
  );
}
