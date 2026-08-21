import { useState } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";

const ReviewModal = ({ tutorName, onSubmit, onClose, isSubmitting }) => {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a1130] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Rate your session</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {tutorName && <p className="mt-1 text-sm text-slate-400">with {tutorName}</p>}

                <div className="mt-5 flex items-center justify-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const starIndex = i + 1;
                        const activeValue = hoverRating || rating;
                        const fillPercent = Math.max(0, Math.min(1, activeValue - i)) * 100;

                        const pickHalf = (e, half) => {
                            const value = half === 'left' ? starIndex - 0.5 : starIndex;
                            if (e.type === 'click') setRating(value);
                            else setHoverRating(value);
                        };

                        return (
                            <div key={starIndex} className="relative h-8 w-8" onMouseLeave={() => setHoverRating(0)}>
                                <Star className="absolute inset-0 h-8 w-8 text-slate-600" />
                                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                                    <Star className="h-8 w-8 fill-amber-300 text-amber-300" />
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 left-0 w-1/2"
                                    onClick={(e) => pickHalf(e, 'left')}
                                    onMouseEnter={(e) => pickHalf(e, 'left')}
                                    aria-label={`${starIndex - 0.5} stars`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 w-1/2"
                                    onClick={(e) => pickHalf(e, 'right')}
                                    onMouseEnter={(e) => pickHalf(e, 'right')}
                                    aria-label={`${starIndex} stars`}
                                />
                            </div>
                        );
                    })}
                    <span className="ml-2 text-sm font-semibold text-white">{(hoverRating || rating).toFixed(1)}</span>
                </div>

                <div className="mt-5">
                    <label className="text-xs font-medium text-slate-400">Comment (optional)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was your session?"
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => onSubmit({ rating, comment })}
                    disabled={isSubmitting}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </motion.div>
        </div>
    );
};

export default ReviewModal;
