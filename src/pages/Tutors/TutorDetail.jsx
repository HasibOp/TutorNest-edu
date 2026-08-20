import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BookOpen, Calendar, CalendarDays, Clock, DollarSign, GraduationCap, Sparkles } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import BookingModal from "./BookingModal";

const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const slotWidthPercent = (slot) => {
    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    return Math.max(8, Math.min(100, ((end - start) / (24 * 60)) * 100 * 4));
};

const TutorDetail = () => {
    const { id } = useParams();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const { data: tutor, isPending, isError } = useQuery({
        queryKey: ['tutor-profile', id],
        queryFn: async () => (await axiosPublic.get(`/tutor-profiles/${id}`)).data,
    });

    const { mutate: bookSession, isPending: isBooking } = useMutation({
        mutationFn: async ({ date, subject }) =>
            (await axiosSecure.post('/bookings', {
                tutorProfileId: id,
                date,
                day: selectedSlot.day,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                subject,
            })).data,
        onSuccess: () => {
            toast.success('Session booked!');
            setSelectedSlot(null);
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to book session');
        },
    });

    const handleSlotClick = (slot) => {
        if (!user) {
            navigate('/signin', { state: { from: { pathname: `/tutors/${id}` } } });
            return;
        }
        setSelectedSlot(slot);
    };

    if (isPending) {
        return <Loader></Loader>;
    }

    if (isError || !tutor) {
        return (
            <div className="min-h-screen bg-[#020921] px-4 py-16 text-center">
                <p className="text-slate-300">Tutor not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020921] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1130]">
                    <img
                        src="/tutorsBanner.png"
                        alt=""
                        className="absolute inset-y-0 right-0 w-2/5 object-cover [mask-image:linear-gradient(to_left,black,transparent)]"/>
                    <div className="relative flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
                        <div className="relative shrink-0">
                            <img
                                src={tutor.photo || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
                                alt={tutor.name || "Tutor"}
                                className="h-20 w-20 rounded-full object-cover ring-2 ring-fuchsia-400/40"
                            />
                            <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a1130] bg-emerald-400" />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                                <Sparkles className="h-4 w-4 text-amber-300" />
                                <h1 className="text-xl font-bold text-white sm:text-2xl">{tutor.name || 'Unnamed Tutor'}</h1>
                            </div>
                            {tutor.categoryName && (
                                <span className="mt-1.5 inline-block rounded-full bg-fuchsia-500/15 px-3 py-0.5 text-xs font-semibold text-fuchsia-300">
                                    {tutor.categoryName}
                                </span>
                            )}
                            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-white sm:justify-start">
                                <DollarSign className="h-4 w-4 text-fuchsia-400" />
                                {tutor.hourlyRate}
                                <span className="font-normal text-slate-400">/hr</span>
                            </div>
                        </div>

                        <a
                            href="#availability"
                            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
                            Book Session
                        </a>
                    </div>
                </div>

                {tutor.bio && (
                    <div className="rounded-2xl border border-white/10 bg-[#0a1130] p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/15 text-fuchsia-300">
                                <GraduationCap className="h-4 w-4" />
                            </span>
                            <h2 className="text-sm font-semibold text-white">About Me</h2>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">{tutor.bio}</p>
                    </div>
                )}

                {tutor.subjects?.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-[#0a1130] p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/15 text-fuchsia-300">
                                <BookOpen className="h-4 w-4" />
                            </span>
                            <h2 className="text-sm font-semibold text-white">Subjects</h2>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {tutor.subjects.map((subject) => (
                                <div
                                    key={subject}
                                    className="rounded-xl border border-amber-400/20 bg-fuchsia-500/10 px-4 py-4 text-center text-sm font-medium text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-colors hover:bg-white/15">
                                    {subject}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tutor.availability?.length > 0 && (
                    <div id="availability" className="scroll-mt-6 rounded-2xl border border-white/10 bg-[#0a1130] p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/15 text-fuchsia-300">
                                <Calendar className="h-4 w-4" />
                            </span>
                            <h2 className="text-sm font-semibold text-white">Weekly Availability</h2>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Select a slot to book a session.</p>
                        <div className="mt-4 space-y-2.5">
                            {tutor.availability.map((slot, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => handleSlotClick(slot)}
                                    className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 text-left transition-colors hover:bg-fuchsia-500/15 cursor-pointer">
                                    <span className="inline-flex w-24 shrink-0 items-center gap-3 text-sm font-medium text-white">
                                        <CalendarDays className="h-3.5 w-3.5 text-amber-400" />
                                        {slot.day}
                                    </span>
                                    <div className="h-1.5 flex-1 rounded-full bg-white/10">
                                        <div
                                            className="h-1.5 rounded-full bg-linear-to-r from-amber-200 to-amber-500"
                                            style={{ width: `${slotWidthPercent(slot)}%` }}
                                        />
                                    </div>
                                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        {slot.startTime} - {slot.endTime}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-center text-xs text-slate-500">
                            All times are shown in your local time zone
                        </p>
                    </div>
                )}
            </div>

            {selectedSlot && (
                <BookingModal
                    slot={selectedSlot}
                    subjects={tutor.subjects}
                    onConfirm={bookSession}
                    onClose={() => setSelectedSlot(null)}
                    isSubmitting={isBooking}
                ></BookingModal>
            )}
        </div>
    );
};

export default TutorDetail;
