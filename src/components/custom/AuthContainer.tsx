"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Stethoscope,
  ChevronLeft,
  MapPin,
  Upload,
  CheckCircle2,
  HeartPulse,
  GraduationCap,
  Hash,
  Plus,
  Minus,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useRole } from "@/lib/role-context";
import { registerAction } from "@/app/actions/auth";
import {
  loginSchema,
  patientBasicInfoSchema,
  patientConcernSchema,
  patientLocationSchema,
  studentAcademicSchema,
  studentClinicSchema,
  type LoginFormData,
} from "@/lib/auth-schemas";

/* ─────────────────────────────────────────────
 * Types & Interfaces
 * ───────────────────────────────────────────── */
type AuthView = "login" | "register";
type UserRole = "student" | "patient" | "university" | null;

interface CaseRequirement {
  id: number;
  name: string;
  count: number;
}

interface Availability {
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
}

export interface AuthContainerProps {
  initialView?: AuthView;
}

/* ─────────────────────────────────────────────
 * Dentara Luxury Auth Container
 * Split-panel sliding overlay with login ↔ register toggle
 * Role-aware validation, dynamic titles, intelligent routing
 * ───────────────────────────────────────────── */
const AuthContainer: React.FC<AuthContainerProps> = ({
  initialView = "login",
}) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { setAuth, setRole } = useRole();

  /* ── UI State ── */
  const [view, setView] = useState<AuthView>(initialView);
  const [regStep, setRegStep] = useState<number>(1);
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showPatientPassword, setShowPatientPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  /** Login-only server error (wrong credentials); cleared when user types again */
  const [serverError, setServerError] = useState<string | null>(null);
  const registerSectionRef = useRef<HTMLDivElement>(null);

  /* ── Form State (for non-RHF fields: cases, availability) ── */
  const [cases, setCases] = useState<CaseRequirement[]>([
    { id: 1, name: "Tooth Removal", count: 0 },
    { id: 2, name: "Gum Care", count: 0 },
    { id: 3, name: "Tooth Filling", count: 0 },
    { id: 4, name: "Tooth Replacement", count: 0 },
  ]);
  const [availability, setAvailability] = useState<Availability>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  /* ── Dynamic document.title (fixes Sticky Title bug) ── */
  useEffect(() => {
    document.title = view === "login" ? "Sign in | Dentara" : "Create Account | Dentara";
  }, [view]);

  const isLogin = view === "login";

  /* ── Login Form (RHF + Zod) - onSubmit: validate only on submit so server error can show ── */
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ── Step-aware resolver: validates only the current step's schema ── */
  const stepResolver = React.useCallback((
    values: Record<string, unknown>,
    _context: unknown
  ): { values: Record<string, unknown>; errors: Record<string, { message: string }> } => {
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? (v as string).trim() : v])
    ) as Record<string, unknown>;
    if (role === "student") {
      if (regStep === 2) {
        const result = studentAcademicSchema.safeParse({
          fullName: values.fullName,
          email: values.email,
          school: trimmed.school,
          yearLevel: trimmed.yearLevel,
          studentId: trimmed.studentId,
          username: trimmed.username,
          password: trimmed.password,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          return {
            values,
            errors: Object.fromEntries(
              Object.entries(err).map(([k, v]) => [k, { message: Array.isArray(v) ? v[0] : String(v ?? "") }])
            ) as Record<string, { message: string }>,
          };
        }
        return { values, errors: {} };
      }
      if (regStep === 5) {
        const result = studentClinicSchema.safeParse({ clinicAddress: values.clinicAddress });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          return {
            values,
            errors: Object.fromEntries(
              Object.entries(err).map(([k, v]) => [k, { message: Array.isArray(v) ? v[0] : String(v ?? "") }])
            ) as Record<string, { message: string }>,
          };
        }
        return { values, errors: {} };
      }
    } else if (role === "patient") {
      if (regStep === 2) {
        const result = patientBasicInfoSchema.safeParse({
          fullName: trimmed.fullName,
          age: trimmed.age,
          phone: trimmed.phone,
          email: trimmed.email,
          password: trimmed.password,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          return {
            values,
            errors: Object.fromEntries(
              Object.entries(err).map(([k, v]) => [k, { message: Array.isArray(v) ? v[0] : String(v ?? "") }])
            ) as Record<string, { message: string }>,
          };
        }
        return { values, errors: {} };
      }
      if (regStep === 3) {
        const result = patientConcernSchema.safeParse({ concern: trimmed.concern });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          return {
            values,
            errors: Object.fromEntries(
              Object.entries(err).map(([k, v]) => [k, { message: Array.isArray(v) ? v[0] : String(v ?? "") }])
            ) as Record<string, { message: string }>,
          };
        }
        return { values, errors: {} };
      }
      if (regStep === 4) {
        const result = patientLocationSchema.safeParse({ location: trimmed.location });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          return {
            values,
            errors: Object.fromEntries(
              Object.entries(err).map(([k, v]) => [k, { message: Array.isArray(v) ? v[0] : String(v ?? "") }])
            ) as Record<string, { message: string }>,
          };
        }
        return { values, errors: {} };
      }
    }
    return { values, errors: {} };
  }, [role, regStep]);

  /* ── Register Form (RHF for student/patient flows) with step-aware validation ── */
  const registerForm = useForm({
    resolver: stepResolver as never,
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      age: "",
      phone: "",
      email: "",
      password: "",
      concern: "",
      location: "",
      school: "",
      yearLevel: "",
      studentId: "",
      username: "",
      clinicAddress: "",
    },
  });

  const nextStep = () => setRegStep((s) => s + 1);
  const prevStep = () => setRegStep((s) => s - 1);

  const toggleView = (target: AuthView) => {
    setView(target);
    setAuthError(null);
    setServerError(null);
    loginForm.clearErrors();
    registerForm.clearErrors();
    if (target === "register") setRegStep(1);
    loginForm.reset();
    registerForm.reset();
    window.history.pushState(null, "", `/app/${target}`);
  };

  const handleLogin = loginForm.handleSubmit(async (data) => {
    setServerError(null);
    setAuthError(null);
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setServerError("The email or password is incorrect.");
        setIsLoading(false);
        return;
      }
      const session = await getSession();
      if (session?.user?.id && (session.user.role === "student" || session.user.role === "patient" || session.user.role === "university")) {
        setAuth(session.user.role, {
          id: session.user.id,
          email: session.user.email ?? "",
          fullName: session.user.name ?? "",
        });
        
        startTransition(() => {
          if (session.user.role === "student") router.push("/app/student");
          else if (session.user.role === "patient") router.push("/app/patient");
          else if (session.user.role === "university") router.push("/app/university");
        });
      } else {
        setServerError("Could not load session. Please try again.");
        setIsLoading(false);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  });

  /** Field names for the current step (for form.trigger) */
  const getCurrentStepFields = (): ("fullName" | "age" | "phone" | "email" | "password" | "concern" | "location" | "school" | "yearLevel" | "studentId" | "username" | "clinicAddress")[] => {
    if (role === "student") {
      if (regStep === 2) return ["fullName", "email", "school", "yearLevel", "studentId", "username", "password"];
      if (regStep === 5) return ["clinicAddress"];
    } else if (role === "patient") {
      if (regStep === 2) return ["fullName", "age", "phone", "email", "password"];
      if (regStep === 3) return ["concern"];
      if (regStep === 4) return ["location"];
    }
    return [];
  };

  /** Validate only the current step's fields using form.trigger(); returns true if valid */
  const validateCurrentStep = async (): Promise<boolean> => {
    const fields = getCurrentStepFields();
    if (fields.length === 0) return true;
    return registerForm.trigger(fields);
  };

  /** Validate current step only (no other steps); sets field errors and returns true if valid (sync fallback) */
  const validateCurrentStepSync = (): boolean => {
    const values = registerForm.getValues();
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    ) as typeof values;

    if (role === "student") {
      if (regStep === 2) {
        const result = studentAcademicSchema.safeParse({
          fullName: values.fullName,
          email: values.email,
          school: trimmed.school,
          yearLevel: trimmed.yearLevel,
          studentId: trimmed.studentId,
          username: trimmed.username,
          password: trimmed.password,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          Object.entries(err).forEach(([k, v]) =>
            registerForm.setError(k as keyof typeof values, {
              message: Array.isArray(v) ? v[0] : v,
            })
          );
          return false;
        }
      } else if (regStep === 5) {
        const result = studentClinicSchema.safeParse({
          clinicAddress: values.clinicAddress,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          Object.entries(err).forEach(([k, v]) =>
            registerForm.setError(k as keyof typeof values, {
              message: Array.isArray(v) ? v[0] : v,
            })
          );
          return false;
        }
      }
    } else if (role === "patient") {
      if (regStep === 2) {
        const result = patientBasicInfoSchema.safeParse({
          fullName: trimmed.fullName,
          age: trimmed.age,
          phone: trimmed.phone,
          email: trimmed.email,
          password: trimmed.password,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          Object.entries(err).forEach(([k, v]) =>
            registerForm.setError(k as keyof typeof values, {
              message: Array.isArray(v) ? v[0] : v,
            })
          );
          return false;
        }
      } else if (regStep === 3) {
        const result = patientConcernSchema.safeParse({
          concern: trimmed.concern,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          Object.entries(err).forEach(([k, v]) =>
            registerForm.setError(k as keyof typeof values, {
              message: Array.isArray(v) ? v[0] : v,
            })
          );
          return false;
        }
      } else if (regStep === 4) {
        const result = patientLocationSchema.safeParse({
          location: trimmed.location,
        });
        if (!result.success) {
          const err = result.error.flatten().fieldErrors;
          Object.entries(err).forEach(([k, v]) =>
            registerForm.setError(k as keyof typeof values, {
              message: Array.isArray(v) ? v[0] : v,
            })
          );
          return false;
        }
      }
    }
    return true;
  };

  /** Handle Next button: validate ONLY current step's fields, then increment on success */
  const handleNextStep = () => {
    if (role === null) return;
    registerForm.clearErrors();
    setAuthError(null);
    if (!validateCurrentStepSync()) {
      registerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    nextStep();
  };

  const handleRegister = async () => {
    if (role === null) return;

    const isIntermediateStep =
      (role === "student" && regStep < 5) || (role === "patient" && regStep < 4);
    if (isIntermediateStep) {
      handleNextStep();
      return;
    }

    registerForm.clearErrors();
    setAuthError(null);
    if (!(await validateCurrentStep())) return;

    setIsLoading(true);
    setAuthError(null);

    const raw = registerForm.getValues();
    const values = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, typeof v === "string" ? (v as string).trim() : v])
    ) as Record<string, string | undefined>;
    // Ensure required fields are never undefined (avoids "Invalid input" / server validation errors)
    // Ensure required fields are never undefined (avoids "Invalid input" / server validation errors)
    const payload = {
      role,
      fullName: (values.fullName ?? "").trim(),
      email: (values.email ?? "").trim().toLowerCase(),
      password: values.password ?? "",
      
      // Patient fields (Keep as empty strings so Zod validates them properly)
      age: values.age?.trim() || "",
      phone: values.phone?.trim() || "",
      concern: values.concern?.trim() || "",
      location: values.location?.trim() || "",
      
      // Student fields (Use undefined so the database saves them as completely empty NULLs)
      school: values.school?.trim() || undefined,
      yearLevel: values.yearLevel?.trim() || undefined,
      studentId: values.studentId?.trim() || undefined,
      username: values.username?.trim() || undefined,
      clinicAddress: values.clinicAddress?.trim() || undefined,
      
      cases: role === "student" ? cases : [],
      availability: role === "student" ? { ...availability } : undefined,
    };

    const result = await registerAction(payload);

    if (!result.success) {
      setAuthError(result.error);
      setIsLoading(false);
      return;
    }

    setAuthError(null);
    setRegStep(role === "student" ? 6 : 5);

    try {
      // 1. Silently log the user in using the credentials they just created
      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
      
      // 2. Get the session to confirm their role
      const session = await getSession();
      const userRole = session?.user?.role || role; 
      
      setAuth(userRole, {
        id: session?.user?.id || result.userId,
        email: session?.user?.email ?? payload.email,
        fullName: session?.user?.name ?? payload.fullName,
      });

      // 3. Force the redirect to the specific dashboard!
      startTransition(() => {
        if (userRole === "student") {
          router.push("/app/student"); 
        } else {
          router.push("/app/patient"); 
        }
      });

    } catch (error) {
      // Even if the silent login hiccups, push them to the dashboard anyway
      startTransition(() => {
        if (role === "student") {
          router.push("/app/student");
        } else {
          router.push("/app/patient");
        }
      });
    }
    
    setIsLoading(false);
  };

  const handleCaseCount = (id: number, delta: number) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c
      )
    );
  };

  const toggleDay = (day: keyof Availability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  /* ─────────────────────────────────────────
   * Render
   * ───────────────────────────────────────── */
  return (
    <div suppressHydrationWarning className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-surface overflow-hidden font-sans selection:bg-brand-teal/20">
      <div className="fixed top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-teal/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-brand-navy/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl h-[720px] flex bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mx-4 z-10"
      >
        {/* ── LUXURY SLIDING OVERLAY (Desktop) ── */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-brand-teal via-brand-navy to-brand-navy z-30 transition-all duration-700 ease-in-out hidden md:flex flex-col items-center justify-center p-12 text-white text-center shadow-2xl
          ${isLogin ? "translate-x-full" : "translate-x-0"}`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
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
              onClick={() => toggleView(isLogin ? "register" : "login")}
              className="mt-8 px-12 py-4 border border-white/30 rounded-full font-bold hover:bg-white hover:text-brand-navy transition-all duration-300 transform hover:scale-105 active:scale-95 min-h-[44px]"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════
         * LOGIN FORM SECTION
         * ═══════════════════════════════════════ */}
        {/* ═══════════════════════════════════════
         * LOGIN FORM SECTION
         * ═══════════════════════════════════════ */}
        <div
          className={`w-full md:w-1/2 flex flex-col items-center justify-center transition-all duration-700 ${isLogin ? "opacity-100 translate-x-0 z-20" : "opacity-0 -translate-x-12 pointer-events-none"}`}
        >
          {/* Removed the space-y-8 here to give us precise control */}
          <div className="w-full max-w-[340px] px-6 md:px-0">
            
            {/* Added mb-10 to create that clean gap before the form */}
            <header className="mb-10 text-left">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-1">
                Sign In
              </h1>
              <p className="text-slate-500 text-[15px]">Enter your portal credentials</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Fixed-height slot for login server error */}
              <div className="h-12 min-h-[1.25rem] flex flex-col justify-end pb-2">
                {serverError && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="text-red-500 shrink-0" size={16} />
                    {serverError}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-teal transition-colors"
                    size={18}
                  />
                  <input
                    {...loginForm.register("email", {
                      onChange: () => setServerError(null),
                    })}
                    type="email"
                    placeholder="name@clinic.com"
                    className={`w-full bg-gray-50 rounded-2xl min-h-[44px] py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-brand-teal/10 transition-all outline-none placeholder:text-gray-300 border ${loginForm.formState.errors.email ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                  />
                </div>
                <div className="h-5 flex items-center gap-1.5 ml-1 mt-1">
                  {loginForm.formState.errors.email && (
                    <>
                      <AlertCircle className="text-red-500 shrink-0" size={14} />
                      <p className="text-xs text-red-500">
                        {loginForm.formState.errors.email.message}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-teal transition-colors"
                    size={18}
                  />
                  <input
                    {...loginForm.register("password", {
                      onChange: () => setServerError(null),
                    })}
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-gray-50 rounded-2xl min-h-[44px] py-4 pl-12 pr-12 text-gray-900 focus:ring-2 focus:ring-brand-teal/10 transition-all outline-none placeholder:text-gray-300 border ${loginForm.formState.errors.password ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                
                {/* Error slot and Forgot Password alignment */}
                <div className="flex items-start justify-between mt-1 px-1">
                  <div className="h-5 flex items-center gap-1.5">
                    {loginForm.formState.errors.password && (
                      <>
                        <AlertCircle className="text-red-500 shrink-0" size={14} />
                        <p className="text-xs text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {/* Forgot Password sits below the input and above the button */}
                  <button
                    type="button"
                    className="text-[10px] text-brand-teal font-bold uppercase tracking-widest hover:text-brand-navy transition-colors mt-1"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isPending || loginForm.formState.isSubmitting}
                className="w-full bg-brand-teal hover:bg-brand-navy text-white font-bold min-h-[44px] py-5 rounded-2xl shadow-lg shadow-brand-teal/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-6 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(isLoading || isPending) ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Access Portal <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <p className="md:hidden text-center text-gray-400 text-sm">
              New here?{" "}
              <button
                onClick={() => toggleView("register")}
                className="text-brand-teal font-semibold ml-1"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════
         * REGISTER FORM SECTION (Multi-Step)
         * ═══════════════════════════════════════ */}
        <div
          ref={registerSectionRef}
          className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 absolute right-0 h-full transition-all duration-700 ${!isLogin ? "opacity-100 translate-x-0 z-20" : "opacity-0 translate-x-12 pointer-events-none md:z-10"}`}
        >
          <div className="h-full flex flex-col py-12 w-full max-w-[420px] mx-auto overflow-y-auto no-scrollbar">
            {regStep < 6 && (
              <div className="flex gap-2 mb-8 shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= regStep ? "bg-brand-teal" : "bg-gray-100"}`}
                  />
                ))}
              </div>
            )}

            {/* Reserved error slot (h-14) to prevent layout shift when "Invalid input" or server error appears */}
            <div className="min-h-[1.25rem] h-14 flex flex-col justify-center mb-2">
              {authError && !isLogin && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  {authError}
                </div>
              )}
            </div>

            {/* ── STEP 1: Role Selection ── */}
            {regStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <header>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Choose your role
                  </h1>
                  <p className="text-brand-gray mt-2">
                    Personalizing your Dentara experience
                  </p>
                </header>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => {
                      setRoleState("patient");
                      nextStep();
                    }}
                    className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-brand-teal/30 hover:shadow-xl transition-all text-left flex items-center gap-5 min-h-[44px]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shrink-0">
                      <HeartPulse size={28} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg">
                        Patient
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Seeking care and consultation
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setRoleState("student");
                      nextStep();
                    }}
                    className="group p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-brand-navy/30 hover:shadow-xl transition-all text-left flex items-center gap-5 min-h-[44px]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all shrink-0">
                      <GraduationCap size={28} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg">
                        Dental Student
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Managing clinical requirements
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ── STUDENT STEP 2: Academic Info ── */}
            {regStep === 2 && role === "student" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Academic Info
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Full Name
                    </label>
                    <input
                      {...registerForm.register("fullName")}
                      type="text"
                      placeholder="Dr. Juan Dela Cruz"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:bg-white border ${registerForm.formState.errors.fullName ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.fullName && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.fullName.message}</p>
                        </>
                      )}
                    </div>
                    {/* Email Address */}
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-teal transition-colors"
                        size={16}
                      />
                      <input
                        {...registerForm.register("email")}
                        type="email"
                        placeholder="juan@university.edu.ph"
                        className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 pl-11 pr-4 text-gray-900 outline-none border ${registerForm.formState.errors.email ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                      />
                    </div>
                    <div className="h-5 flex items-center gap-1.5 ml-1">
                      {registerForm.formState.errors.email && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Dental School
                    </label>
                    <input
                      {...registerForm.register("school")}
                      type="text"
                      placeholder="UP / UST / CEU"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:bg-white border ${registerForm.formState.errors.school ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.school && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.school.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Year Level
                    </label>
                    <input
                      {...registerForm.register("yearLevel")}
                      type="text"
                      placeholder="4th Year"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:bg-white border ${registerForm.formState.errors.yearLevel ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.yearLevel && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.yearLevel.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Student ID
                    </label>
                    <div className="relative">
                      <Hash
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      />
                      <input
                        {...registerForm.register("studentId")}
                        type="text"
                        placeholder="2024-XXXXX"
                        className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 pl-11 text-gray-900 outline-none border ${registerForm.formState.errors.studentId ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                      />
                    </div>
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.studentId && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.studentId.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Username
                    </label>
                    <input
                      {...registerForm.register("username")}
                      type="text"
                      placeholder="dent_juan"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none focus:bg-white border ${registerForm.formState.errors.username ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.username && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.username.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerForm.register("password")}
                        type={showStudentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 pr-12 px-4 text-gray-900 outline-none focus:bg-white border ${registerForm.formState.errors.password ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowStudentPassword(!showStudentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      >
                        {showStudentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.password && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRegister()}
                  disabled={isLoading}
                  className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* ── STUDENT STEP 3: Case Goals ── */}
            {regStep === 3 && role === "student" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Case Goals
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="space-y-4">
                  <p className="text-sm text-brand-gray">
                    Set how many patients you want for each case:
                  </p>
                  <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                    {cases.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl"
                      >
                        <span className="font-semibold text-gray-700">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleCaseCount(item.id, -1)}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-brand-teal">
                            {item.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCaseCount(item.id, 1)}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Save Goals <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* ── STUDENT STEP 4: Availability ── */}
            {regStep === 4 && role === "student" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Clinic Availability
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="space-y-6">
                  <p className="text-sm text-brand-gray">
                    Which days are you active in the clinic?
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {(
                      Object.keys(availability) as Array<keyof Availability>
                    ).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-12 h-12 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center
                          ${availability[day] ? "bg-brand-teal border-brand-teal text-white shadow-lg" : "bg-white border-gray-100 text-gray-400 hover:border-brand-teal/30"}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center gap-3">
                    <Clock
                      className="text-brand-teal shrink-0"
                      size={20}
                    />
                    <p className="text-xs text-brand-navy/70 leading-relaxed font-medium">
                      Standard clinical hours (8am – 5pm) will be assigned by
                      default.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  One Last Step
                </button>
              </div>
            )}

            {/* ── STUDENT STEP 5: Clinic Location ── */}
            {regStep === 5 && role === "student" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Clinic Location
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="space-y-6">
                  <div className="text-center p-8 bg-gray-50 rounded-[32px] border border-gray-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-bl-full group-hover:scale-125 transition-transform" />
                    <MapPin
                      className="text-brand-teal mx-auto mb-4 relative z-10"
                      size={48}
                    />
                    <h3 className="text-gray-900 font-bold relative z-10">
                      Assign Your Clinic
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 relative z-10">
                      Where will patients visit you?
                    </p>
                  </div>
                  <input
                    {...registerForm.register("clinicAddress")}
                    type="text"
                    placeholder="Enter complete clinic address..."
                    className={`w-full bg-gray-50 rounded-2xl min-h-[44px] py-5 px-6 text-gray-900 outline-none focus:bg-white transition-all shadow-sm border ${registerForm.formState.errors.clinicAddress ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                  />
                  <div className="h-5 flex items-center gap-1.5">
                    {registerForm.formState.errors.clinicAddress && (
                      <>
                        <AlertCircle className="text-red-500 shrink-0" size={14} />
                        <p className="text-xs text-red-500">{registerForm.formState.errors.clinicAddress.message}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-brand-navy hover:opacity-90 min-h-[44px] py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            )}

            {/* ── PATIENT STEP 2: Basic Info ── */}
            {regStep === 2 && role === "patient" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Basic Info
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Full Name
                    </label>
                    <input
                      {...registerForm.register("fullName")}
                      type="text"
                      placeholder="Juan Dela Cruz"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none border ${registerForm.formState.errors.fullName ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.fullName && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.fullName.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Age
                    </label>
                    <input
                      {...registerForm.register("age")}
                      type="number"
                      placeholder="25"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none border ${registerForm.formState.errors.age ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.age && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.age.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Phone
                    </label>
                    <input
                      {...registerForm.register("phone")}
                      type="tel"
                      placeholder="+63"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none border ${registerForm.formState.errors.phone ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.phone && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.phone.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Email
                    </label>
                    <input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="juan@email.com"
                      className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 px-4 text-gray-900 outline-none border ${registerForm.formState.errors.email ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                    />
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.email && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerForm.register("password")}
                        type={showPatientPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-3 pr-12 px-4 text-gray-900 outline-none border ${registerForm.formState.errors.password ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPatientPassword(!showPatientPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      >
                        {showPatientPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="h-5 flex items-center gap-1.5">
                      {registerForm.formState.errors.password && (
                        <>
                          <AlertCircle className="text-red-500 shrink-0" size={14} />
                          <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRegister()}
                  disabled={isLoading}
                  className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* ── PATIENT STEP 3: Concern ── */}
            {regStep === 3 && role === "patient" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Your Concern
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="space-y-4">
                  <textarea
                    {...registerForm.register("concern")}
                    placeholder="Describe your dental needs..."
                    className={`w-full bg-gray-50 rounded-xl min-h-[44px] py-4 px-4 text-gray-900 outline-none h-32 resize-none focus:bg-white transition-all border ${registerForm.formState.errors.concern ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                  />
                  <div className="h-5 flex items-center gap-1.5">
                    {registerForm.formState.errors.concern && (
                      <>
                        <AlertCircle className="text-red-500 shrink-0" size={14} />
                        <p className="text-xs text-red-500">{registerForm.formState.errors.concern.message}</p>
                      </>
                    )}
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-white transition-all group">
                    <Upload
                      size={24}
                      className="text-gray-300 group-hover:text-brand-teal transition-colors mb-2"
                    />
                    <span className="text-xs text-gray-400">
                      Click to upload photo
                    </span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleRegister()}
                  disabled={isLoading}
                  className="w-full bg-brand-teal min-h-[44px] py-4 rounded-xl text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* ── PATIENT STEP 4: Location ── */}
            {regStep === 4 && role === "patient" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Your Location
                  </h1>
                  <button
                    onClick={prevStep}
                    className="text-gray-300 hover:text-gray-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <ChevronLeft />
                  </button>
                </header>
                <div className="space-y-4 text-center">
                  <MapPin
                    className="text-brand-teal mx-auto mb-4"
                    size={40}
                  />
                  <input
                    {...registerForm.register("location")}
                    type="text"
                    placeholder="Enter your city/area"
                    className={`w-full bg-gray-50 rounded-2xl min-h-[44px] py-5 px-6 text-gray-900 outline-none focus:bg-white transition-all border ${registerForm.formState.errors.location ? "border-red-500" : "border-gray-200 focus:border-brand-teal/50"}`}
                  />
                  <div className="h-5 flex items-center gap-1.5">
                    {registerForm.formState.errors.location && (
                      <>
                        <AlertCircle className="text-red-500 shrink-0" size={14} />
                        <p className="text-xs text-red-500">{registerForm.formState.errors.location.message}</p>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 px-4 italic leading-relaxed">
                    This helps us match you with dentistry students within your
                    geographic proximity.
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-brand-navy hover:opacity-90 min-h-[44px] py-5 rounded-2xl text-white font-bold flex items-center justify-center shadow-xl disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Find Care Now"
                  )}
                </button>
              </div>
            )}

            {/* ── SUCCESS (Both Flows) - Role-aware welcome ── */}
            {(regStep === 6 || (regStep === 5 && role === "patient")) && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal">
                  <CheckCircle2
                    size={64}
                    className="animate-in zoom-in duration-1000"
                  />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome{role ? `, ${role === "student" ? "Student" : "Patient"}` : ""}!
                  </h1>
                  <p className="text-brand-gray max-w-[280px]">
                    Verification is underway. You will be redirected shortly.
                  </p>
                </div>
                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-brand-teal w-1/2 animate-pulse" />
                </div>
              </div>
            )}

            <p className="md:hidden text-center text-gray-400 text-sm mt-8">
              Already a member?{" "}
              <button
                onClick={() => toggleView("login")}
                className="text-brand-teal font-semibold ml-1"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthContainer;
