import auth from "@/firebase/firebase.config";
import AuthContext from "@/provider/AuthContext";
import { browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import SocialLink from "./SocialLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUPPORT_EMAIL = 'mail@gmail.com';

const AUTH_ERROR_MESSAGES = {
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

const Login = () => {

    const { signInUser, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        setSubmitting(true);
        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            const result = await signInUser(email, password);
            const user = result.user;
            setUser(user);
            Swal.fire({
                title: 'You’re now logged in and ready to explore!',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(AUTH_ERROR_MESSAGES[error?.code] || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <Helmet>
                <title>Sign in | TutorNest-edu</title>
            </Helmet>

            <div className="bg-[#020921] relative grid min-h-screen items-center justify-center gap-10 overflow-hidden px-4 py-10 lg:grid-cols-2 lg:px-10">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[110px]"
                        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-400/20 blur-[110px]"
                        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
                        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 mx-auto w-full max-w-md rounded-[1.75rem] border border-white/10 bg-white/4 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
                    <h2 className="flex items-center justify-center gap-2 text-center font-heading text-2xl font-bold text-white">
                        Welcome Back!
                    </h2>
                    <p className="mt-1.5 text-center text-sm text-slate-400">
                        Sign in to continue your learning journey.
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4 mt-6">
                        <div>
                            <Label htmlFor="email" className="text-slate-300">
                                Email Address
                            </Label>
                            <div className="relative mt-1">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="pl-9 border-white/10 bg-white/5 text-white placeholder:text-slate-500 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                                    required
                                />
                            </div>
                        </div>


                        <div>
                            <Label htmlFor="password" className="text-slate-300">
                                Password
                            </Label>
                            <div className="relative mt-1">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="pl-9 pr-9 border-white/10 bg-white/5 text-white placeholder:text-slate-500 transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-400">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-fuchsia-500"
                                />
                                Remember me
                            </label>
                            <a
                                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Password reset request')}`}
                                className="text-amber-300 hover:underline">
                                Forgot Password?
                            </a>
                        </div>


                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full gap-2 rounded-full bg-linear-to-r from-amber-300 to-orange-400 py-2 px-4 font-semibold text-[#151b2e] shadow-md shadow-orange-400/20 transition hover:opacity-90 disabled:opacity-60">
                                {submitting ? "Signing in..." : "Login"}
                            </Button>
                        </motion.div>
                        <SocialLink></SocialLink>
                    </form>


                    <div className="mt-4 text-center text-sm text-slate-400">
                        <p>
                            New here? Create an account now!
                            <Link
                                to="/signup"
                                className="text-amber-300 text-lg hover:underline font-medium ml-2">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="relative z-10 hidden flex-col items-center gap-2 text-center lg:flex">
                    <img
                        src="/login.png"
                        alt="Student learning online"
                        className="w-full max-w-md drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
