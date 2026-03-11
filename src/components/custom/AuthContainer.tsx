"use client"

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Mail, Lock, ArrowRight, Eye, EyeOff,
    Stethoscope, ChevronLeft, MapPin, Upload,
    CheckCircle2, HeartPulse, GraduationCap,
    Hash, Plus, Minus, Clock
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
 * Types & Interfaces
 * ───────────────────────────────────────────── */
type AuthView = 'login' | 'register';
type UserRole = 'student' | 'patient' | null;

interface CaseRequirement { id: number; name: string; count: number; }

interface Availability {
    Mon: boolean; Tue: boolean; Wed: boolean; Thu: boolean;
    Fri: boolean; Sat: boolean; Sun: boolean;
}

interface FormData {
    fullName: string; phone: string; email: string; password: string;
    age: string; concern: string; location: string;
    school: string; yearLevel: string; studentId: string;
    username: string; clinicAddress: string;
    cases: CaseRequirement[];
    availability: Availability;
}

/**
 * AuthContainer Props — route pages pass `initialView` to set mode.
 * The toggle animation is client-side; URL syncs via router.push.
 */
export interface AuthContainerProps {
    initialView?: AuthView;
}

/* ─────────────────────────────────────────────
 * Dentara Luxury Auth Container
 * Split-panel sliding overlay with login ↔ register toggle
 * ───────────────────────────────────────────── */
const AuthContainer: React.FC<AuthContainerProps> = ({ initialView = 'login' }) => {
    const router = useRouter();

    /* ── UI State ── */
    const [view, setView] = useState<AuthView>(initialView);
    const [regStep, setRegStep] = useState<number>(1);
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /* ── Form State ── */
    const [formData, setFormData] = useState<FormData>({
        fullName: '', age: '', phone: '', email: '', password: '',
        concern: '', location: '', school: '', yearLevel: '',
        studentId: '', username: '', clinicAddress: '',
        cases: [
            { id: 1, name: 'Extraction', count: 0 },
            { id: 2, name: 'Prophylaxis', count: 0 },
            { id: 3, name: 'Restorative', count: 0 },
            { id: 4, name: 'Prosthodontics', count: 0 },
        ],
        availability: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    });

    const isLogin = view === 'login';

    const nextStep = () => setRegStep(s => s + 1);
    const prevStep = () => setRegStep(s => s - 1);

    const toggleView = (target: AuthView) => {
        setView(target);
        if (target === 'register') setRegStep(1);
        // pushState updates the URL without a navigation, so the component
        // stays mounted and the 700ms CSS slide animation plays smoothly.
        window.history.pushState(null, '', `/app/${target}`);
    };

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); router.push('/app/home'); }, 1500);
    };

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setRegStep(role === 'student' ? 6 : 5);
            setTimeout(() => router.push('/app/home'), 3000);
        }, 2000);
    };

    const handleCaseCount = (id: number, delta: number) => {
        setFormData(prev => ({
            ...prev,
            cases: prev.cases.map(c => c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c),
        }));
    };

    const toggleDay = (day: keyof Availability) => {
        setFormData(prev => ({
            ...prev,
            availability: { ...prev.availability, [day]: !prev.availability[day] },
        }));
    };

    /* ─────────────────────────────────────────
     * Render
     * ───────────────────────────────────────── */
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-light overflow-hidden font-sans selection:bg-brand-teal/20">

            {/* ── Background Decorative Glows ── */}
            <div className="fixed top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-teal/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-brand-dark/5 blur-[100px] rounded-full pointer-events-none" />

            {/* ══════════════════════════════════════
             * MAIN AUTH CARD
             * ══════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-5xl h-[720px] flex bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mx-4 z-10"
            >

                {/* ── LUXURY SLIDING OVERLAY (Desktop) ── */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-brand-teal via-brand-dark to-brand-dark z-30 transition-all duration-700 ease-in-out hidden md:flex flex-col items-center justify-center p-12 text-white text-center shadow-2xl
                    ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Stethoscope className="text-white w-10 h-10" />
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight">
                            {isLogin ? 'Join the Circle' : 'Welcome Home'}
                        </h2>
                        <p className="text-blue-50/80 leading-relaxed max-w-[300px] mx-auto text-lg font-light">
                            {isLogin
                                ? 'Be part of the most advanced dental network.'
                                : 'Your professional workspace is ready for you.'}
                        </p>

                        <button
                            onClick={() => toggleView(isLogin ? 'register' : 'login')}
                            className="mt-8 px-12 py-4 border border-white/30 rounded-full font-bold hover:bg-white hover:text-brand-dark transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[44px]"
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                 * LOGIN FORM SECTION
                 * ═══════════════════════════════════════ */}
                <div className={`w-full md:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
                    <div className="w-full max-w-[340px] px-6 md:px-0 space-y-8">
                        <header className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Sign In</h1>
                            <p className="text-brand-gray">Enter your portal credentials</p>
                        </header>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-teal transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@clinic.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl min-h-[44px] py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-brand-teal/10 focus:border-brand-teal/50 transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Password</label>
                                    <button type="button" className="text-[10px] text-brand-teal font-bold uppercase tracking-widest hover:text-brand-dark transition-colors min-h-[44px] flex items-center">Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-teal transition-colors" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl min-h-[44px] py-4 pl-12 pr-12 text-gray-900 focus:ring-2 focus:ring-brand-teal/10 focus:border-brand-teal/50 transition-all outline-none placeholder:text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-teal hover:bg-brand-dark text-white font-bold min-h-[44px] py-5 rounded-2xl shadow-lg shadow-brand-teal/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 text-lg disabled:opacity-60"
                            >
                                {isLoading
                                    ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <>Access Portal <ArrowRight size={20} /></>
                                }
                            </button>
                        </form>

                        <p className="md:hidden text-center text-gray-400 text-sm">
                            New here?{' '}
                            <button onClick={() => toggleView('register')} className="text-brand-teal font-semibold ml-1">Register Now</button>
                        </p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                 * REGISTER FORM SECTION (Multi-Step)
                 * ═══════════════════════════════════════ */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 absolute right-0 h-full transition-all duration-700 ${!isLogin ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 translate-x-12 pointer-events-none md:z-10'}`}>
                    <div className="h-full flex flex-col justify-center py-12 w-full max-w-[420px] mx-auto overflow-y-auto no-scrollbar">

                        {/* Progress Bar */}
                        {regStep < 6 && (
                            <div className="flex gap-2 mb-8 shrink-0">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= regStep ? 'bg-brand-teal' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                        )}

                        {/* ── STEP 1: Role Selection ── */}
                        {regStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Choose your role</h1>
                                    <p className="text-brand-gray mt-2">Personalizing your Dentara experience</p>
                                </header>
                                <div className="grid grid-cols-1 gap-4">
                                    <button onClick={() => { setRole('patient'); nextStep(); }} className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-brand-teal/30 hover:shadow-xl transition-all text-left flex items-center gap-5 min-h-[44px]">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shrink-0">
                                            <HeartPulse size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-lg">Patient</h3>
                                            <p className="text-gray-400 text-sm">Seeking care and consultation</p>
                                        </div>
                                    </button>
                                    <button onClick={() => { setRole('student'); nextStep(); }} className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-brand-dark/30 hover:shadow-xl transition-all text-left flex items-center gap-5 min-h-[44px]">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all shrink-0">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-lg">Dental Student</h3>
                                            <p className="text-gray-400 text-sm">Managing clinical requirements</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── STUDENT STEP 2: Academic Info ── */}
                        {regStep === 2 && role === 'student' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Academic Info</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <input type="text" placeholder="Dr. Juan Dela Cruz" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Dental School</label>
                                        <input type="text" placeholder="UP / UST / CEU" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Year Level</label>
                                        <input type="text" placeholder="4th Year" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Student ID</label>
                                        <div className="relative">
                                            <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input type="text" placeholder="2024-XXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 pl-11 text-gray-900 outline-none focus:border-brand-teal/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Username</label>
                                        <input type="text" placeholder="dent_juan" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white" />
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold hover:opacity-90 transition-all">Next: Case Targets</button>
                            </div>
                        )}

                        {/* ── STUDENT STEP 3: Clinical Quotas ── */}
                        {regStep === 3 && role === 'student' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Clinical Quotas</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-4">
                                    <p className="text-sm text-brand-gray">Specify your target number of patients per case:</p>
                                    <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                                        {formData.cases.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                                <span className="font-semibold text-gray-700">{item.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => handleCaseCount(item.id, -1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all"><Minus size={14} /></button>
                                                    <span className="w-8 text-center font-bold text-brand-teal">{item.count}</span>
                                                    <button type="button" onClick={() => handleCaseCount(item.id, 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2">Set Availability <ArrowRight size={18} /></button>
                            </div>
                        )}

                        {/* ── STUDENT STEP 4: Availability ── */}
                        {regStep === 4 && role === 'student' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Clinic Availability</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-6">
                                    <p className="text-sm text-brand-gray">Which days are you active in the clinic?</p>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {(Object.keys(formData.availability) as Array<keyof Availability>).map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`w-12 h-12 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center
                                                    ${formData.availability[day]
                                                        ? 'bg-brand-teal border-brand-teal text-white shadow-lg'
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-brand-teal/30'}`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center gap-3">
                                        <Clock className="text-brand-teal shrink-0" size={20} />
                                        <p className="text-xs text-brand-dark/70 leading-relaxed font-medium">Standard clinical hours (8am – 5pm) will be assigned by default.</p>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold mt-4">One Last Step</button>
                            </div>
                        )}

                        {/* ── STUDENT STEP 5: Clinic Location ── */}
                        {regStep === 5 && role === 'student' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Clinic Location</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-6">
                                    <div className="text-center p-8 bg-gray-50 rounded-[32px] border border-gray-100 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-bl-full group-hover:scale-125 transition-transform" />
                                        <MapPin className="text-brand-teal mx-auto mb-4 relative z-10" size={48} />
                                        <h3 className="text-gray-900 font-bold relative z-10">Assign Your Clinic</h3>
                                        <p className="text-gray-400 text-sm mt-1 relative z-10">Where will patients visit you?</p>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter complete clinic address..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl min-h-[44px] py-5 px-6 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className="w-full bg-brand-dark hover:opacity-90 min-h-[44px] py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all shadow-xl"
                                >
                                    {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Complete Registration'}
                                </button>
                            </div>
                        )}

                        {/* ── PATIENT STEP 2: Basic Info ── */}
                        {regStep === 2 && role === 'patient' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Basic Info</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <input type="text" placeholder="Juan Dela Cruz" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Age</label>
                                        <input type="number" placeholder="25" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone</label>
                                        <input type="tel" placeholder="+63" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                                        <input type="email" placeholder="juan@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:border-brand-teal/50" />
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold">Next: Concern</button>
                            </div>
                        )}

                        {/* ── PATIENT STEP 3: Concern ── */}
                        {regStep === 3 && role === 'patient' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Your Concern</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-4">
                                    <textarea placeholder="Describe your dental needs..." className="w-full bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] py-4 px-4 text-gray-900 outline-none h-32 resize-none focus:border-brand-teal/50 focus:bg-white transition-all" />
                                    <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-white transition-all group">
                                        <Upload size={24} className="text-gray-300 group-hover:text-brand-teal transition-colors mb-2" />
                                        <span className="text-xs text-gray-400">Click to upload photo</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                </div>
                                <button onClick={nextStep} className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold">Next: Location</button>
                            </div>
                        )}

                        {/* ── PATIENT STEP 4: Location ── */}
                        {regStep === 4 && role === 'patient' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Your Location</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-4 text-center">
                                    <MapPin className="text-brand-teal mx-auto mb-4" size={40} />
                                    <input type="text" placeholder="Enter your city/area" className="w-full bg-gray-50 border border-gray-200 rounded-2xl min-h-[44px] py-5 px-6 text-gray-900 outline-none focus:border-brand-teal/50 focus:bg-white transition-all" />
                                    <p className="text-xs text-gray-400 mt-2 px-4 italic leading-relaxed">This helps us match you with dentistry students within your geographic proximity.</p>
                                </div>
                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className="w-full bg-brand-dark hover:opacity-90 min-h-[44px] py-5 rounded-2xl text-white font-bold shadow-xl disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Find Care Now'}
                                </button>
                            </div>
                        )}

                        {/* ── SUCCESS (Both Flows) ── */}
                        {(regStep === 6 || (regStep === 5 && role === 'patient')) && (
                            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal">
                                    <CheckCircle2 size={64} className="animate-in zoom-in duration-1000" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900">Welcome to Dentara!</h1>
                                    <p className="text-brand-gray max-w-[280px]">Verification is underway. You will be redirected shortly.</p>
                                </div>
                                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-brand-teal w-1/2 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {/* Mobile toggle */}
                        <p className="md:hidden text-center text-gray-400 text-sm mt-8">
                            Already a member?{' '}
                            <button onClick={() => toggleView('login')} className="text-brand-teal font-semibold ml-1">Sign In</button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthContainer;