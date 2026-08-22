import { motion } from "framer-motion";
import { DollarSign, ListTree, User } from "lucide-react";

const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60";

const BasicsSection = ({ categories, categoryId, setCategoryId, hourlyRate, setHourlyRate, bio, setBio }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                    <User className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold text-white">The basics</h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="tutor-category" className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <ListTree className="h-3.5 w-3.5" /> Category
                    </label>
                    <select
                        id="tutor-category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className={inputClass}>
                        <option value="" disabled className="bg-[#0a1130] text-white">Select a category</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id} className="bg-[#0a1130] text-white">{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tutor-rate" className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <DollarSign className="h-3.5 w-3.5" /> Hourly rate (USD)
                    </label>
                    <input
                        id="tutor-rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="25"
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor="tutor-bio" className="text-xs font-medium text-slate-400">
                    Bio <span className="text-slate-500">— this is what students read first</span>
                </label>
                <textarea
                    id="tutor-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about your teaching experience..."
                    rows={4}
                    className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60"
                />
            </div>
        </motion.section>
    );
};

export default BasicsSection;
