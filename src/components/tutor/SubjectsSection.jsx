import { AnimatePresence, motion } from "framer-motion";
import { Plus, Tag, X } from "lucide-react";

const SubjectsSection = ({ subjects, subjectInput, setSubjectInput, addSubject, removeSubject }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    <Tag className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold text-white">Subjects you teach</h2>
                <span className="ml-auto text-xs text-slate-400">{subjects.length} added</span>
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addSubject();
                        }
                    }}
                    placeholder="e.g. Algebra, press Enter to add"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60"
                />
                <motion.button
                    type="button"
                    onClick={addSubject}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15">
                    <Plus className="h-4 w-4" /> Add
                </motion.button>
            </div>

            {subjects.length === 0 ? (
                <p className="mt-3.5 text-xs text-slate-500">
                    Add at least one subject — students browse by these.
                </p>
            ) : (
                <motion.div layout className="mt-3.5 flex flex-wrap gap-2">
                    <AnimatePresence initial={false}>
                        {subjects.map((subject) => (
                            <motion.span
                                key={subject}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/15 px-3 py-1.5 text-xs font-medium text-fuchsia-300">
                                {subject}
                                <button
                                    type="button"
                                    onClick={() => removeSubject(subject)}
                                    aria-label={`Remove ${subject}`}
                                    className="transition-colors hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.section>
    );
};

export default SubjectsSection;
