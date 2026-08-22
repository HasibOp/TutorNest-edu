import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap } from "lucide-react";
import CountUp from "@/components/admin/CountUp";

const ProfileHeader = ({ checklist, completeness }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-fuchsia-500/10 via-transparent to-violet-500/10 px-6 py-6 sm:px-8">
            <motion.div
                className="pointer-events-none absolute -top-20 right-10 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[100px]"
                animate={{ x: [0, 24, 0], y: [0, 14, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex flex-wrap items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex items-center gap-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300">
                        <GraduationCap className="h-6 w-6" />
                    </span>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">Tutor Profile</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Keep this current so students can find and book you.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                    className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-heading text-2xl font-bold text-white">
                            <CountUp value={completeness} duration={0.9} />%
                        </p>
                        <p className="text-xs text-slate-400">Profile complete</p>
                    </div>
                    <div className="h-14 w-40">
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completeness}%` }}
                                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                                className="h-full rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500"
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {checklist.map((item) => (
                                <span
                                    key={item.label}
                                    title={`${item.label}: ${item.done ? 'done' : 'still needed'}`}
                                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                                        item.done
                                            ? 'bg-emerald-500/15 text-emerald-300'
                                            : 'bg-white/5 text-slate-500'
                                    }`}>
                                    {item.done && <CheckCircle2 className="h-2.5 w-2.5" />}
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileHeader;
