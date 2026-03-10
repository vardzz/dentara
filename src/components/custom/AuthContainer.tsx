'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    Stethoscope,
    ChevronLeft,
    Phone,
    Calendar,
    MapPin,
    Upload,
    CheckCircle2,
    HeartPulse,
    GraduationCap
} from 'lucide-react';

/**
 * Dentara Luxury Auth Component
 * - Fixed: Restored next/navigation and initialView props for correct Next.js routing.
 * - Fixed: Sign-in form is now perfectly centered.
 * - Fixed: Placeholders in registration are fully visible.
 * - Features: Multi-step role-based registration, sliding transitions.
 */

interface AuthContainerProps {
    initialView: 'login' | 'register';
}

export default function AuthContainer({ initialView }: AuthContainerProps) {
    const router = useRouter();

    // View State (Simulated Routing)
    const [view, setView] = useState<'login' | 'register'>(initialView);

    // Registration Flow States
    const [regStep, setRegStep] = useState(1);
    const [role, setRole] = useState<string | null>(null); // 'student' or 'patient'
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        phone: '',
        email: '',
        password: '',
        concern: '',
        photo: null as File | null,
        location: ''
    });

    // Keep internal state synced if route changes externally
    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const isLogin = view === 'login';

    const nextStep = () => setRegStep(prev => prev + 1);
    const prevStep = () => setRegStep(prev => prev - 1);

    const toggleView = (targetView: 'login' | 'register') => {
        setView(targetView);
        if (targetView === 'register') setRegStep(1);

        // Smoothly update URL without full page reload
        window.history.pushState(null, '', `/${targetView}`);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setRegStep(5); // Success state
            setTimeout(() => router.push('/'), 3000); // Redirect to app
        }, 2000);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Decorative Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <div className="relative w-full max-w-5xl h-[660px] md:h-[700px] flex bg-[#111] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden mx-4 z-10">

                {/* --- LUXURY SLIDING OVERLAY (Desktop Only) --- */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 z-30 transition-all duration-700 ease-in-out hidden md:flex flex-col items-center justify-center p-12 text-white text-center shadow-2xl
            ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Stethoscope className="text-white w-10 h-10" />
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight">
                            {isLogin ? "Join the Circle" : "Welcome Home"}
                        </h2>
                        <p className="text-blue-100/70 leading-relaxed max-w-[300px] mx-auto text-lg font-light">
                            {isLogin
                                ? "Be part of the most advanced dental network."
                                : "Your professional workspace is ready for you."}
                        </p>

                        <button
                            onClick={() => toggleView(isLogin ? 'register' : 'login')}
                            className="mt-8 px-12 py-4 border border-white/30 rounded-full font-bold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            {isLogin ? "Create Account" : "Sign In"}
                        </button>
                    </div>
                </div>

                {/* --- LEFT SIDE: LOGIN FORM (Centered) --- */}
                <div className={`w-full md:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
                    <div className="w-full max-w-[340px] px-6 md:px-0 space-y-8">
                        <header className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white tracking-tight">Sign In</h1>
                            <p className="text-white/40">Enter your portal credentials</p>
                        </header>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@clinic.com"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Password</label>
                                    <button type="button" className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300">Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 text-lg">
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Access Portal <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <p className="md:hidden text-center text-white/40 text-sm">
                            New to Dentara? <button onClick={() => toggleView('register')} className="text-blue-400 font-semibold ml-1">Register Now</button>
                        </p>
                    </div>
                </div>

                {/* --- RIGHT SIDE: MULTI-STEP REGISTER --- */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 absolute right-0 h-full transition-all duration-700 ${!isLogin ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 translate-x-12 pointer-events-none md:z-10'}`}>
                    <div className="h-full flex flex-col justify-center py-12 w-full max-w-[400px] mx-auto">

                        {/* Step Indicators */}
                        {regStep < 5 && (
                            <div className="flex gap-2 mb-8">
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= regStep ? 'bg-blue-500' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        )}

                        {/* STEP 1: ROLE SELECTION */}
                        {regStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header>
                                    <h1 className="text-3xl font-bold text-white tracking-tight">Choose your role</h1>
                                    <p className="text-white/40 mt-2">Tailoring the experience to your needs</p>
                                </header>
                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => { setRole('patient'); nextStep(); }}
                                        className="group p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-blue-600/10 hover:border-blue-500/30 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                                            <HeartPulse size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Patient</h3>
                                            <p className="text-white/30 text-sm">Looking for professional care</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => { setRole('student'); nextStep(); }}
                                        className="group p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Dental Student</h3>
                                            <p className="text-white/30 text-sm">Expanding professional horizons</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: BASIC INFO */}
                        {regStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-white">Basic Information</h1>
                                    <button onClick={prevStep} className="text-white/30 hover:text-white transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Dr. John Doe"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Age</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                type="number"
                                                placeholder="25"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                type="email"
                                                placeholder="john@clinic.com"
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 text-white outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 group mt-2">
                                    Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* STEP 3: CONCERN & PHOTO */}
                        {regStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-white">Your Concern</h1>
                                    <button onClick={prevStep} className="text-white/30 hover:text-white transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Describe your concern</label>
                                        <textarea
                                            placeholder="Please tell us about your dental needs or specific questions..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-white outline-none h-32 resize-none focus:border-blue-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Photo Reference (Optional)</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all">
                                            <Upload size={24} className="text-white/30 mb-2" />
                                            <span className="text-xs text-white/30">Upload Photo Reference</span>
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-blue-600 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 group">
                                    Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* STEP 4: LOCATION */}
                        {regStep === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-white">Final Step</h1>
                                    <button onClick={prevStep} className="text-white/30 hover:text-white transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-6">
                                    <div className="text-center p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                                        <MapPin className="text-blue-500 mx-auto mb-4" size={40} />
                                        <h3 className="text-white font-bold">Search Location</h3>
                                        <p className="text-white/30 text-sm mt-1">To find the nearest dental clinic and professionals for you.</p>
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter your city or area"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 text-white outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleRegister}
                                    className="w-full bg-blue-600 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Complete Registration"}
                                </button>
                            </div>
                        )}

                        {/* STEP 5: SUCCESS REDIRECT */}
                        {regStep === 5 && (
                            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">All Set!</h1>
                                    <p className="text-white/40 max-w-[280px]">Your Dentara profile is ready. Redirecting you to the main dashboard...</p>
                                </div>
                                <div className="w-12 h-1 border-t-2 border-green-500/50 animate-pulse mt-8" />
                            </div>
                        )}

                        <p className="md:hidden text-center text-white/40 text-sm mt-8">
                            Already have an account? <button onClick={() => toggleView('login')} className="text-blue-400 font-semibold ml-1">Sign In</button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}