import { BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
    { value: "student", label: "Student", sub: "I want to learn", icon: BookOpen },
    { value: "tutor", label: "Tutor", sub: "I want to teach", icon: GraduationCap },
];

const RoleModal = ({ onSelect, isSubmitting }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a1130] p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white">One last step</h2>
                <p className="mt-1 text-sm text-slate-400">Tell us how you'll use TutorNest-edu.</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    {roles.map(({ value, label, sub, icon: Icon }) => (
                        <button
                            key={value}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => onSelect(value)}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                            <Icon className="mx-auto h-6 w-6 text-amber-300" />
                            <p className="mt-2 text-sm font-semibold text-white">{label}</p>
                            <p className="text-xs text-slate-500">{sub}</p>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default RoleModal;
