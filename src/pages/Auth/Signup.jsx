import useAxiosPublic from "@/hooks/useAxiosPublic";
import AuthContext from "@/provider/AuthContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { BookOpen, CalendarClock, ChevronRight, CheckCircle2, Circle, Eye, EyeOff, GraduationCap, Lock, Mail, Sparkles, TrendingUp, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialLink from "./SocialLink";

const AUTH_ERROR_MESSAGES = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/weak-password': 'Please choose a stronger password.',
};

const highlights = [
    { icon: CalendarClock, text: "Book 1-on-1 sessions with expert tutors" },
    { icon: Sparkles, text: "Flexible scheduling that fits your life" },
    { icon: TrendingUp, text: "Track your learning progress over time" },
];

const roles = [
    { value: "student", label: "Student", sub: "I want to learn", icon: BookOpen },
    { value: "tutor", label: "Tutor", sub: "I want to teach", icon: GraduationCap },
];

const Signup = () => {
    const { signUpUser, setUser, userUpdateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [submitting, setSubmitting] = useState(false);

    const passwordChecks = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) }
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (password.length < 8) {
            setError({ ...error, password: "Must be at least 8 characters!!" })
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError({ ...error, password: 'Must include at least one uppercase letter!' })
            return;
        }

        setSubmitting(true);
        try {
            const result = await signUpUser(email, password);
            const user = result.user;
            setUser(user);

            await userUpdateProfile({ displayName: name });

            const userInfoInDB = { name, email, role };
            const res = await axiosPublic.post('/users', userInfoInDB);
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Successfully signed up! Let's get started!!!",
                    icon: "success",
                    draggable: true
                });
            }
            navigate("/");
        } catch (err) {
            toast.error(AUTH_ERROR_MESSAGES[err?.code] || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div>
            <Helmet>
                <title>Sign up | TutorNest-edu</title>
            </Helmet>

            <div className="grid min-h-screen bg-[#020921] lg:grid-cols-2">
                <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/5 p-10 lg:flex xl:p-14">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute -top-24 -right-10 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]"
                            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
                            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-32 -left-10 h-96 w-96 rounded-full bg-amber-400/15 blur-[120px]"
                            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                    </div>

                    <div className="relative z-10">
                        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            GET STARTED
                        </p>
                        <h1 className="mt-4 max-w-md text-balance font-heading text-4xl font-bold leading-[1.15] text-white xl:text-5xl">
                            Start Your Journey Today!
                        </h1>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                            Whether you want to learn a new skill or share your expertise,
                            TutorNest-edu connects you with the right people.
                        </p>

                        <ul className="mt-8 space-y-3">
                            {highlights.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                                        <Icon className="h-4 w-4 text-amber-300" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div />
                </div>

                <div className="flex items-center justify-center px-4 py-14 sm:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-md">

                        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-amber-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            CREATE ACCOUNT
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-bold text-white">
                            Create your account
                        </h2>

                        <form onSubmit={handleRegister} className="mt-6 space-y-5">
                            <div>
                                <Label htmlFor="name" className="text-xs font-semibold tracking-wide text-slate-300">
                                    FULL NAME
                                </Label>
                                <div className="relative mt-1.5">
                                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-xs font-semibold tracking-wide text-slate-300">
                                    EMAIL ADDRESS
                                </Label>
                                <div className="relative mt-1.5">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        autoComplete="email"
                                        className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-xs font-semibold tracking-wide text-slate-300">
                                    PASSWORD
                                </Label>
                                <div className="relative mt-1.5">
                                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError({}); }}
                                        className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    {passwordChecks.map((check) => (
                                        <span
                                            key={check.label}
                                            className={`inline-flex items-center gap-1 text-xs transition-colors ${check.met ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {check.met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                            {check.label}
                                        </span>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {error.password && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-1 text-sm font-medium text-red-400">
                                            {error.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold tracking-wide text-slate-300">
                                    I AM A...
                                </Label>
                                <div className="mt-1.5 grid grid-cols-2 gap-3">
                                    {roles.map(({ value, label, sub, icon: Icon }) => {
                                        const active = role === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRole(value)}
                                                aria-pressed={active}
                                                className={`rounded-2xl border px-4 py-4 text-center transition-all ${
                                                    active
                                                        ? 'border-transparent bg-linear-to-br from-amber-300 to-orange-400 text-[#151b2e] shadow-md shadow-orange-400/20'
                                                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                                }`}>
                                                <Icon className={`mx-auto h-6 w-6 ${active ? 'text-[#151b2e]' : 'text-amber-300'}`} />
                                                <p className="mt-2 text-sm font-semibold">{label}</p>
                                                <p className={`text-xs ${active ? 'text-[#151b2e]/70' : 'text-slate-500'}`}>{sub}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="cursor-pointer h-12 w-full gap-2 rounded-2xl bg-linear-to-r from-amber-300 to-orange-400 text-base font-semibold text-[#151b2e] shadow-md shadow-orange-400/20 transition hover:opacity-90 disabled:opacity-60"
                                >
                                    {submitting ? "Creating account..." : "Create Account"}
                                    {!submitting && <ChevronRight className="h-4 w-4" />}
                                </Button>
                            </motion.div>
                            <SocialLink></SocialLink>
                        </form>

                        <div className="mt-5 text-center text-sm text-slate-400">
                            <p>
                                Already have an account?
                                <Link
                                    to="/signin"
                                    className="ml-2 font-semibold text-amber-300 hover:underline"> 
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
