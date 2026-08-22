import { motion } from "framer-motion";
import CountUp from "@/components/admin/CountUp";
import { fadeUp } from "@/lib/motion";

const TutorStatCard = ({ icon: Icon, label, value, prefix, caption, tone, details, extra, emptyHint, delay }) => {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${tone.card} to-transparent p-5 transition-colors hover:border-white/25`}>
            <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
                    <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-slate-200">{label}</p>
            </div>

            <p className="mt-4 font-heading text-4xl font-bold text-white">
                {prefix}
                <CountUp value={value} delay={delay} />
            </p>

            <p className="mt-1.5 text-xs text-slate-400">{caption}</p>

            <div className="mt-4 flex min-h-7 flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
                {details.length > 0 ? (
                    <>
                        {details.map((detail) => (
                            <span key={detail} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tone.chip}`}>
                                {detail}
                            </span>
                        ))}
                        {extra && (
                            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-400">
                                {extra}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-[11px] text-slate-500">{emptyHint}</span>
                )}
            </div>
        </motion.div>
    );
};

export default TutorStatCard;
