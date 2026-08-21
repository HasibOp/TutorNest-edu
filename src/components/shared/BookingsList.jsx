import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CalendarClock, CheckCircle2, Star, XCircle } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";
import ReviewModal from "@/components/shared/ReviewModal";

const statusStyles = {
    confirmed: 'bg-fuchsia-500/15 text-fuchsia-300',
    completed: 'bg-emerald-500/15 text-emerald-300',
    cancelled: 'bg-red-500/15 text-red-400',
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
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                <CalendarClock className="mx-auto h-8 w-8 text-fuchsia-400" />
                <p className="mt-3 text-sm text-slate-300">No sessions booked yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bookings.map((booking) => (
                <div
                    key={booking._id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-semibold text-white">
                            {perspective === 'tutor' ? booking.studentName || booking.studentEmail : booking.tutorName || booking.tutorEmail}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-400">
                            {booking.subject && `${booking.subject} · `}
                            {new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {booking.startTime}–{booking.endTime}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status] || ''}`}>
                            {booking.status}
                        </span>

                        {booking.status === 'confirmed' && perspective === 'tutor' && (
                            <button
                                type="button"
                                onClick={() => updateStatus({ id: booking._id, status: 'completed' })}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Complete
                            </button>
                        )}
                        {booking.status === 'confirmed' && (
                            <button
                                type="button"
                                onClick={() => updateStatus({ id: booking._id, status: 'cancelled' })}
                                className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25">
                                <XCircle className="h-3.5 w-3.5" />
                                Cancel
                            </button>
                        )}
                        {booking.status === 'completed' && perspective === 'student' && !booking.reviewed && (
                            <button
                                type="button"
                                onClick={() => setReviewTarget(booking)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25">
                                <Star className="h-3.5 w-3.5" />
                                Leave a review
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {reviewTarget && (
                <ReviewModal
                    tutorName={reviewTarget.tutorName}
                    onSubmit={submitReview}
                    onClose={() => setReviewTarget(null)}
                    isSubmitting={isSubmittingReview}
                ></ReviewModal>
            )}
        </div>
    );
};

export default BookingsList;
