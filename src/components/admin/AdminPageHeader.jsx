import { motion } from "framer-motion";
import CountUp from "@/components/admin/CountUp";
import { fadeUp, staggerContainer } from "@/lib/motion";

const TONES = {
    violet: "bg-violet-500/15 text-violet-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    sky: "bg-sky-500/15 text-sky-300",
    rose: "bg-rose-500/15 text-rose-300",
    indigo: "bg-indigo-500/15 text-indigo-300",
    slate: "bg-white/10 text-slate-300",
};

const TEXT_TONES = {
    violet: "text-violet-300",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
    sky: "text-sky-300",
    rose: "text-rose-300",
    indigo: "text-indigo-300",
    slate: "text-white",
};


const AdminPageHeader = ({ icon: Icon, tone = "violet", title, subtitle, stats = [] }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-fuchsia-500/8 via-transparent to-violet-500/8 px-6 py-6 sm:px-7">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-20 right-10 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-[100px]"
                    animate={{ x: [0, 24, 0], y: [0, 14, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}/>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative flex items-center gap-3.5">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`}>
                    <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                    <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">{title}</h1>
                    <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                </div>
            </motion.div>

            {stats.length > 0 && (
                <motion.div
                    variants={staggerContainer(0.07, 0.15)}
                    initial="hidden"
                    animate="visible"
                    className="relative mt-5 flex flex-wrap gap-2.5">
                    {stats.map(({ label, value, tone: chipTone = "slate" }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className="flex items-baseline gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                            <span className={`font-heading text-lg font-bold ${TEXT_TONES[chipTone] || TEXT_TONES.slate}`}>
                                <CountUp value={value} duration={0.9} />
                            </span>
                            <span className="text-xs font-medium text-slate-400">{label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default AdminPageHeader;
