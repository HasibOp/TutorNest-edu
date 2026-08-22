import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Clock, Plus, Trash2 } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AvailabilitySection = ({ availability, addSlot, updateSlot, removeSlot }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                    <CalendarClock className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold text-white">Weekly availability</h2>
                <span className="text-xs text-slate-400">{availability.length} slots</span>
                <motion.button
                    type="button"
                    onClick={addSlot}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/15"
                >
                    <Plus className="h-3.5 w-3.5" /> Add slot
                </motion.button>
            </div>

            {availability.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                    <Clock className="mx-auto h-6 w-6 text-slate-500" />
                    <p className="mt-2.5 text-sm text-slate-400">No availability slots yet</p>
                    <p className="mt-1 text-xs text-slate-500">
                        Students can only book times you've opened here.
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer(0.05)}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 space-y-2.5">
                    <AnimatePresence initial={false}>
                        {availability.map((slot, index) => (
                            <motion.div
                                key={index}
                                layout
                                variants={fadeUp}
                                exit={{ opacity: 0, x: -12 }}
                                className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
                                <select
                                    value={slot.day}
                                    onChange={(e) => updateSlot(index, 'day', e.target.value)}
                                    aria-label={`Day for slot ${index + 1}`}
                                    className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors focus:border-fuchsia-400/60">
                                    {DAYS.map((day) => (
                                        <option key={day} value={day} className="bg-[#0a1130] text-white">{day}</option>
                                    ))}
                                </select>

                                <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                                    aria-label={`Start time for slot ${index + 1}`}
                                    className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors focus:border-fuchsia-400/60"
                                />
                                <span className="text-xs text-slate-500">to</span>
                                <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                                    aria-label={`End time for slot ${index + 1}`}
                                    className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition-colors focus:border-fuchsia-400/60"
                                />

                                <motion.button
                                    type="button"
                                    onClick={() => removeSlot(index)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.94 }}
                                    aria-label={`Remove slot ${index + 1}`}
                                    className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300 transition-colors hover:bg-rose-500/30">
                                    <Trash2 className="h-4 w-4" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.section>
    );
};

export default AvailabilitySection;
