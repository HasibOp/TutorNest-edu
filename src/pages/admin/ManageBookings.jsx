import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";

const statusStyles = {
    confirmed: 'bg-fuchsia-500/15 text-fuchsia-300',
    completed: 'bg-emerald-500/15 text-emerald-300',
    cancelled: 'bg-red-500/15 text-red-400',
};

const filters = ['all', 'confirmed', 'completed', 'cancelled'];

const ManageBookings = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: bookings = [], isPending } = useQuery({
        queryKey: ['admin-bookings'],
        queryFn: async () => (await axiosSecure.get('/bookings/admin')).data,
    });

    const visibleBookings = useMemo(() => {
        if (statusFilter === 'all') return bookings;
        return bookings.filter((b) => b.status === statusFilter);
    }, [bookings, statusFilter]);

    if (isPending) {
        return <Loader></Loader>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
            <p className="mt-1 text-sm text-slate-400">{bookings.length} total bookings</p>

            <div className="mt-6 flex flex-wrap gap-2">
                {filters.map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setStatusFilter(f)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                            statusFilter === f
                                ? 'bg-linear-to-r from-fuchsia-500 to-purple-600 text-white'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}>
                        {f}
                    </button>
                ))}
            </div>

            {visibleBookings.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                    <CalendarClock className="mx-auto h-8 w-8 text-fuchsia-400" />
                    <p className="mt-3 text-sm text-slate-300">No bookings found.</p>
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Tutor</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">Date & Time</th>
                                <th className="px-4 py-3">Rate</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {visibleBookings.map((booking) => (
                                <tr key={booking._id} className="text-slate-200">
                                    <td className="px-4 py-3 font-medium">{booking.studentName || booking.studentEmail}</td>
                                    <td className="px-4 py-3 font-medium">{booking.tutorName || booking.tutorEmail}</td>
                                    <td className="px-4 py-3 text-slate-400">{booking.subject || '—'}</td>
                                    <td className="px-4 py-3 text-slate-400">
                                        {new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {' · '}
                                        {booking.startTime}–{booking.endTime}
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">${booking.hourlyRate}/hr</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status] || ''}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageBookings;
