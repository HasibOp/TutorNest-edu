import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { WEEK } from "../../lib/week";

const DashboardHeader = ({ displayName, slotsByDay, activeDays }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-fuchsia-500/10 via-transparent to-violet-500/10 px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[110px]"
                    animate={{ x: [0, 28, 0], y: [0, 16, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-[110px]"
                    animate={{ x: [0, -22, 0], y: [0, -18, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="flex flex-wrap items-center gap-x-2 font-heading text-3xl font-bold text-white sm:text-4xl">
                        Good to see you,
                        <span className="bg-linear-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                            {displayName}
                        </span>
                        <motion.span
                            animate={{ rotate: [0, 18, -8, 18, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                            className="inline-block origin-[70%_70%]">
                            👋
                        </motion.span>
                    </h1>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                        Manage your lessons and keep your teaching journey moving forward.
                    </p>
                </div>

                <Link to="/dashboard/tutor/profile">
                    <motion.span
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/40 px-5 py-2.5 text-sm font-semibold text-fuchsia-300 transition-colors hover:bg-fuchsia-500/10">
                        <User className="h-4 w-4" /> Edit my profile
                    </motion.span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                className="relative mt-7">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                    Your teaching week
                </p>

                <motion.div
                    variants={staggerContainer(0.05, 0.25)}
                    initial="hidden"
                    animate="visible"
                    className="mt-3 flex flex-wrap gap-2">
                    {WEEK.map(({ key, short }) => {
                        const count = slotsByDay[key] || 0;
                        const isActive = count > 0;
                        return (
                            <motion.div
                                key={key}
                                variants={fadeUp}
                                whileHover={isActive ? { y: -4 } : undefined}
                                title={isActive ? `${count} slot${count > 1 ? 's' : ''} on ${key}` : `No slots on ${key}`}
                                className={`flex min-w-16 flex-col items-center gap-0.5 rounded-2xl border px-3.5 py-2.5 transition-colors ${
                                    isActive
                                        ? 'border-transparent bg-linear-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20'
                                        : 'border-white/10 bg-white/5 text-slate-500'
                                }`}>
                                <span className="text-xs font-bold">{short}</span>
                                <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-600'}`}>
                                    {isActive ? `${count} slot${count > 1 ? 's' : ''}` : '—'}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {activeDays.length === 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                        You haven't opened any days yet — add availability so students can book you.
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default DashboardHeader;
