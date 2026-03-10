"use client"

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
 * Dentara Luxury Auth Component - Light Mode
 * - Palette: Pure White, Slate Gray (#f8fafc), Brand Teal (#138b94), Brand Dark (#0a1f44).
 * - Maintains: Luxury sliding animation, multi-step registration, and centered forms.
 */

interface AuthContainerProps {
    initialView: 'login' | 'register';
}

export default function AuthContainer({ initialView }: AuthContainerProps) {
    const router = useRouter();

    // View State (Simulated Routing)
    const [view, setView] = useState<'login' | 'register'>(initialView);

    // Keep internal state synced if route changes externally
    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    // Registration Flow States
    const [regStep, setRegStep] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [role, setRole] = useState<string | null>(null); // 'student' or 'patient'
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form Data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] overflow-hidden font-sans selection:bg-[#138b94]/20">
            {/* Background Decorative Glows - Softer for Light Mode */}
            <div className="fixed top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#138b94]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-[#3b82f6]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <div className="relative w-full max-w-5xl h-[660px] md:h-[700px] flex bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mx-4 z-10">

                {/* --- LUXURY SLIDING OVERLAY (Desktop Only) --- */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#138b94] via-[#0a1f44] to-[#0a1f44] z-30 transition-all duration-700 ease-in-out hidden md:flex flex-col items-center justify-center p-12 text-white text-center shadow-2xl
            ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Stethoscope className="text-white w-10 h-10" />
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight">
                            {isLogin ? "Join the Circle" : "Welcome Home"}
                        </h2>
                        <p className="text-blue-50/80 leading-relaxed max-w-[300px] mx-auto text-lg font-light">
                            {isLogin
                                ? "Be part of the most advanced dental network."
                                : "Your professional workspace is ready for you."}
                        </p>

                        <button
                            onClick={() => toggleView(isLogin ? 'register' : 'login')}
                            className="mt-8 px-12 py-4 border border-white/30 rounded-full font-bold hover:bg-white hover:text-[#0a1f44] transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            {isLogin ? "Create Account" : "Sign In"}
                        </button>
                    </div>
                </div>

                {/* --- LEFT SIDE: LOGIN FORM (Centered) --- */}
                <div className={`w-full md:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${isLogin ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
                    <div className="w-full max-w-[340px] px-6 md:px-0 space-y-8">
                        <header className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Sign In</h1>
                            <p className="text-gray-500">Enter your portal credentials</p>
                        </header>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@clinic.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-[#138b94]/10 focus:border-[#138b94]/50 transition-all outline-none placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Password</label>
                                    <button type="button" className="text-[10px] text-[#138b94] font-bold uppercase tracking-widest hover:text-[#3b82f6]">Reset</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-12 text-gray-900 focus:ring-2 focus:ring-[#138b94]/10 focus:border-[#138b94]/50 transition-all outline-none placeholder:text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-5 rounded-2xl shadow-lg shadow-[#3b82f6]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4 text-lg">
                                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Access Portal <ArrowRight size={20} /></>}
                            </button>
                        </form>

                        <p className="md:hidden text-center text-gray-400 text-sm">
                            New to Dentara? <button onClick={() => toggleView('register')} className="text-[#138b94] font-semibold ml-1">Register Now</button>
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
                                    <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= regStep ? 'bg-[#138b94]' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                        )}

                        {/* STEP 1: ROLE SELECTION */}
                        {regStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Choose your role</h1>
                                    <p className="text-gray-500 mt-2">Tailoring the experience to your needs</p>
                                </header>
                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => { setRole('patient'); nextStep(); }}
                                        className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#138b94]/30 hover:shadow-xl hover:shadow-[#138b94]/5 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#138b94] group-hover:bg-[#138b94] group-hover:text-white transition-all shrink-0">
                                            <HeartPulse size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-lg">Patient</h3>
                                            <p className="text-gray-400 text-sm">Looking for professional care</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => { setRole('student'); nextStep(); }}
                                        className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#3b82f6]/30 hover:shadow-xl hover:shadow-[#3b82f6]/5 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white transition-all shrink-0">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-lg">Dental Student</h3>
                                            <p className="text-gray-400 text-sm">Expanding professional horizons</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: BASIC INFO */}
                        {regStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94]" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Dr. John Doe"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 text-gray-900 outline-none focus:border-[#138b94]/50 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Age</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94]" size={16} />
                                            <input
                                                type="number"
                                                placeholder="25"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 text-gray-900 outline-none focus:border-[#138b94]/50 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94]" size={16} />
                                            <input
                                                type="tel"
                                                placeholder="+63"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 text-gray-900 outline-none focus:border-[#138b94]/50 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94]" size={16} />
                                            <input
                                                type="email"
                                                placeholder="john@clinic.com"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 text-gray-900 outline-none focus:border-[#138b94]/50 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-[#3b82f6] py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 group mt-2 hover:bg-[#2563eb] transition-all">
                                    Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* STEP 3: CONCERN & PHOTO */}
                        {regStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Your Concern</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Describe your concern</label>
                                        <textarea
                                            placeholder="Please tell us about your dental needs or specific questions..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-gray-900 outline-none h-32 resize-none focus:border-[#138b94]/50 focus:bg-white transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Photo Reference (Optional)</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:border-[#138b94]/30 transition-all">
                                            <Upload size={24} className="text-gray-300 group-hover:text-[#138b94] mb-2" />
                                            <span className="text-xs text-gray-400">Upload Photo Reference</span>
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full bg-[#3b82f6] py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 group hover:bg-[#2563eb] transition-all">
                                    Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* STEP 4: LOCATION */}
                        {regStep === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <header className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">Final Step</h1>
                                    <button onClick={prevStep} className="text-gray-300 hover:text-gray-900 transition-colors"><ChevronLeft /></button>
                                </header>
                                <div className="space-y-6">
                                    <div className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                        <MapPin className="text-[#138b94] mx-auto mb-4" size={40} />
                                        <h3 className="text-gray-900 font-bold">Search Location</h3>
                                        <p className="text-gray-500 text-sm mt-1">To find the nearest dental clinic and professionals for you.</p>
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#138b94]" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter your city or area"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 pl-12 text-gray-900 outline-none focus:border-[#138b94]/50 focus:bg-white transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleRegister}
                                    className="w-full bg-[#3b82f6] py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 hover:bg-[#2563eb] transition-all shadow-xl shadow-[#3b82f6]/10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Complete Registration"}
                                </button>
                            </div>
                        )}

                        {/* STEP 5: SUCCESS REDIRECT */}
                        {regStep === 5 && (
                            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-[#138b94]/10 rounded-full flex items-center justify-center text-[#138b94]">
                                    <CheckCircle2 size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900">All Set!</h1>
                                    <p className="text-gray-500 max-w-[280px]">Your Dentara profile is ready. Redirecting you to the main dashboard...</p>
                                </div>
                                <div className="w-12 h-1 border-t-2 border-[#138b94]/30 animate-pulse mt-8" />
                            </div>
                        )}

                        <p className="md:hidden text-center text-gray-400 text-sm mt-8">
                            Already have an account? <button onClick={() => toggleView('login')} className="text-[#138b94] font-semibold ml-1">Sign In</button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}