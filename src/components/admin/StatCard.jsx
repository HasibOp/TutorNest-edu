import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import CountUp from "@/components/admin/CountUp";

const TONES = {
    violet: {
        card: "from-violet-500/12",
        icon: "bg-violet-500/15 text-violet-300",
        badge: "bg-violet-500/15 text-violet-300",
        bar: "from-violet-500 to-fuchsia-400",
    },
    sky: {
        card: "from-sky-500/12",
        icon: "bg-sky-500/15 text-sky-300",
        badge: "bg-sky-500/15 text-sky-300",
        bar: "from-sky-500 to-cyan-400",
    },
    amber: {
        card: "from-amber-500/12",
        icon: "bg-amber-500/15 text-amber-300",
        badge: "bg-amber-500/15 text-amber-300",
        bar: "from-amber-500 to-yellow-400",
    },
    indigo: {
        card: "from-indigo-500/12",
        icon: "bg-indigo-500/15 text-indigo-300",
        badge: "bg-indigo-500/15 text-indigo-300",
        bar: "from-indigo-500 to-violet-400",
    },
    emerald: {
        card: "from-emerald-500/12",
        icon: "bg-emerald-500/15 text-emerald-300",
        badge: "bg-emerald-500/15 text-emerald-300",
        bar: "from-emerald-500 to-teal-400",
    },
    rose: {
        card: "from-rose-500/12",
        icon: "bg-rose-500/15 text-rose-300",
        badge: "bg-rose-500/15 text-rose-300",
        bar: "from-rose-500 to-red-400",
    },
};

const StatCard = ({ icon: Icon, label, value, sub, subIcon: SubIcon, share, tone, delay }) => {
    const t = TONES[tone];

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${t.card} to-transparent p-5 transition-colors hover:border-white/25`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
                        <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold text-slate-200">{label}</p>
                </div>

                {share !== null && (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.badge}`}>
                        {share}% of users
                    </span>
                )}
            </div>

            <p className="mt-4 font-heading text-4xl font-bold text-white">
                <CountUp value={value} delay={delay} />
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                <SubIcon className="h-3.5 w-3.5" />
                {sub}
            </p>

            {share !== null && (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${share}%` }}
                        transition={{ duration: 0.9, delay: delay + 0.15, ease: "easeOut" }}
                        className={`h-full rounded-full bg-linear-to-r ${t.bar}`}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
