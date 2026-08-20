import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toISODate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const upcomingDatesForDay = (day, count = 6) => {
    const targetIndex = WEEKDAYS.indexOf(day);
    const dates = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (dates.length < count) {
        if (cursor.getDay() === targetIndex) {
            dates.push(new Date(cursor));
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
};

const BookingModal = ({ slot, subjects = [], onConfirm, onClose, isSubmitting }) => {
    const dateOptions = upcomingDatesForDay(slot.day);
    const [selectedDate, setSelectedDate] = useState(toISODate(dateOptions[0]));
    const [subject, setSubject] = useState(subjects[0] || "");

    const handleConfirm = () => {
        onConfirm({ date: selectedDate, subject });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a1130] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Book Session</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                    {slot.day}, {slot.startTime} – {slot.endTime}
                </p>

                <div className="mt-5">
                    <label className="text-xs font-medium text-slate-400">Choose a date</label>
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-fuchsia-400/60">
                        {dateOptions.map((date) => (
                            <option
                                key={toISODate(date)}
                                value={toISODate(date)}
                                className="bg-[#0a1130] text-white">
                                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </option>
                        ))}
                    </select>
                </div>

                {subjects.length > 0 && (
                    <div className="mt-4">
                        <label className="text-xs font-medium text-slate-400">Subject</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-fuchsia-400/60">
                            {subjects.map((s) => (
                                <option key={s} value={s} className="bg-[#0a1130] text-white">{s}</option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
            </motion.div>
        </div>
    );
};

export default BookingModal;
