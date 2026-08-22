import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, CalendarClock, Clock, DollarSign, Search, Tag } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";
import Avatar from "@/components/shared/Avatar";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { fadeUp, staggerContainer } from "@/lib/motion";

const STATUS_META = {
    confirmed: { pill: 'bg-fuchsia-500/15 text-fuchsia-300', dot: 'bg-fuchsia-400' },
    completed: { pill: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400' },
    cancelled: { pill: 'bg-rose-500/15 text-rose-300', dot: 'bg-rose-400' },
};

const FILTERS = ['all', 'confirmed', 'completed', 'cancelled'];
const EMPTY_COPY = {
    all: { title: 'No bookings yet', hint: 'Sessions will appear here as students book tutors.' },
    confirmed: { title: 'No confirmed bookings', hint: 'Upcoming sessions will show up here once students book.' },
    completed: { title: 'No completed sessions', hint: 'Sessions appear here after a tutor marks them complete.' },
    cancelled: { title: 'No cancelled bookings', hint: 'Nothing has been cancelled — that\'s good news.' },
};

const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ManageBookings = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { data: bookings = [], isPending } = useQuery({
        queryKey: ['admin-bookings'],
        queryFn: async () => (await axiosSecure.get('/bookings/admin')).data,
    });

    const counts = useMemo(() => ({
        all: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }), [bookings]);

    const visibleBookings = useMemo(() => {
        const term = search.trim().toLowerCase();
        return bookings.filter((b) => {
            if (statusFilter !== 'all' && b.status !== statusFilter) return false;
            if (!term) return true;
            return [b.studentName, b.studentEmail, b.tutorName, b.tutorEmail, b.subject]
                .some((field) => String(field || '').toLowerCase().includes(term));
        });
    }, [bookings, statusFilter, search]);

    if (isPending) {
        return <Loader></Loader>;
    }

    const empty = EMPTY_COPY[statusFilter] || EMPTY_COPY.all;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={CalendarClock}
                tone="amber"
                title="Manage Bookings"
                subtitle="Every session booked between students and tutors."
                stats={[
                    { label: 'Total', value: counts.all, tone: 'slate' },
                    { label: 'Confirmed', value: counts.confirmed, tone: 'violet' },
                    { label: 'Completed', value: counts.completed, tone: 'emerald' },
                    { label: 'Cancelled', value: counts.cancelled, tone: 'rose' },
                ]}
            ></AdminPageHeader>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by student, tutor or subject..."
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60"
                    />
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setStatusFilter(filter)}
                            aria-pressed={statusFilter === filter}
                            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                                statusFilter === filter
                                    ? 'bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/20'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}>
                            {filter}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                    statusFilter === filter ? 'bg-white/25' : 'bg-white/10'
                                }`}>
                                {counts[filter]}
                            </span>
                        </button>
                    ))}

                    <span className="ml-auto text-xs text-slate-400">
                        {visibleBookings.length} shown
                    </span>
                </div>
            </motion.div>

            {visibleBookings.length === 0 ? (
                <EmptyState
                    icon={search.trim() ? Search : CalendarClock}
                    title={search.trim() ? 'Nothing matches that search' : empty.title}
                    hint={search.trim() ? 'Try a different student, tutor, or subject.' : empty.hint}
                ></EmptyState>
            ) : (
                <motion.div
                    key={`${statusFilter}-${search}`}
                    variants={staggerContainer(0.05, 0.05)}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2.5">
                    <AnimatePresence initial={false}>
                        {visibleBookings.map((booking) => {
                            const meta = STATUS_META[booking.status] || STATUS_META.confirmed;
                            const student = booking.studentName || booking.studentEmail;
                            const tutor = booking.tutorName || booking.tutorEmail;

                            return (
                                <motion.div
                                    key={booking._id}
                                    layout
                                    variants={fadeUp}
                                    exit={{ opacity: 0, y: -8 }}
                                    whileHover={{ y: -3 }}
                                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/25 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <Avatar name={student} size="sm" ring="ring-sky-400/30"></Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-white">{student}</p>
                                                <p className="text-[11px] text-slate-500">Student</p>
                                            </div>
                                        </div>

                                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />

                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <Avatar name={tutor} size="sm" ring="ring-amber-400/30"></Avatar>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-white">{tutor}</p>
                                                <p className="text-[11px] text-slate-500">Tutor</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:shrink-0">
                                        {booking.subject && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/10 px-2.5 py-1 text-xs font-medium text-fuchsia-300">
                                                <Tag className="h-3 w-3" />
                                                {booking.subject}
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDate(booking.date)}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {booking.startTime}–{booking.endTime}
                                        </span>

                                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-300">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            {booking.hourlyRate}/hr
                                        </span>

                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${meta.pill}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                            {booking.status}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ManageBookings;
