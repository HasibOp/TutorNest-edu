import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Calendar, CalendarClock, CheckCircle2, Clock, Star, XCircle } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";
import ReviewModal from "@/components/shared/ReviewModal";
import { fadeUp, staggerContainer } from "@/lib/motion";

const statusStyles = {
    confirmed: 'bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-inset ring-fuchsia-400/20',
    completed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/20',
    cancelled: 'bg-red-500/15 text-red-400 ring-1 ring-inset ring-red-400/20',
};

const statusDot = {
    confirmed: 'bg-fuchsia-400',
    completed: 'bg-emerald-400',
    cancelled: 'bg-red-400',
};

const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const BookingsList = ({ perspective }) => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [reviewTarget, setReviewTarget] = useState(null);

    const { data: bookings = [], isPending } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => (await axiosSecure.get('/bookings')).data,
    });

    const { mutate: updateStatus } = useMutation({
        mutationFn: async ({ id, status }) =>
            (await axiosSecure.patch(`/bookings/${id}/status`, { status })).data,
        onSuccess: () => {
            toast.success('Booking updated');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update booking');
        },
    });

    const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
        mutationFn: async ({ rating, comment }) =>
            (await axiosSecure.post('/reviews', {
                bookingId: reviewTarget._id,
                rating,
                comment,
            })).data,
        onSuccess: () => {
            toast.success('Review submitted');
            setReviewTarget(null);
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to submit review');
        },
    });

    if (isPending) {
        return <Loader></Loader>;
    }

    if (bookings.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500/10">
                    <CalendarClock className="h-6 w-6 text-fuchsia-400" />
                </motion.span>
                <p className="mt-3 text-sm text-slate-300">No sessions booked yet.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            animate="visible"
            className="space-y-3">
            {bookings.map((booking) => {
                const counterpartName = perspective === 'tutor'
                    ? (booking.studentName || booking.studentEmail)
                    : (booking.tutorName || booking.tutorEmail);

                return (
                    <motion.div
                        key={booking._id}
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3.5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 text-sm font-bold text-white shadow-[0_0_14px_rgba(217,70,239,0.3)]">
                                {getInitials(counterpartName)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-white">{counterpartName}</p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {booking.subject && (
                                        <span className="rounded-full bg-fuchsia-500/10 px-2.5 py-0.5 text-xs font-medium text-fuchsia-300">
                                            {booking.subject}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        {booking.startTime}–{booking.endTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:shrink-0">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status] || ''}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[booking.status] || 'bg-slate-400'}`} />
                                {booking.status}
                            </span>

                            {booking.status === 'confirmed' && perspective === 'tutor' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => updateStatus({ id: booking._id, status: 'completed' })}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Complete
                                </motion.button>
                            )}
                            {booking.status === 'confirmed' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => updateStatus({ id: booking._id, status: 'cancelled' })}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25">
                                    <XCircle className="h-3.5 w-3.5" />
                                    Cancel
                                </motion.button>
                            )}
                            {booking.status === 'completed' && perspective === 'student' && !booking.reviewed && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => setReviewTarget(booking)}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25">
                                    <Star className="h-3.5 w-3.5" />
                                    Leave a review
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {reviewTarget && (
                <ReviewModal
                    tutorName={reviewTarget.tutorName}
                    onSubmit={submitReview}
                    onClose={() => setReviewTarget(null)}
                    isSubmitting={isSubmittingReview}
                ></ReviewModal>
            )}
        </motion.div>
    );
};

export default BookingsList;
