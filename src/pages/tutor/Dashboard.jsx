import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarClock, DollarSign, GraduationCap, User } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import BookingsList from "@/components/shared/BookingsList";
import DashboardHeader from "@/components/tutor/DashboardHeader";
import TutorStatCard from "@/components/tutor/TutorStatCard";
import { WEEK } from "@/lib/week";
import { staggerContainer } from "@/lib/motion";

const Dashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: profile, isPending } = useQuery({
        queryKey: ['tutor-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/tutor-profiles/me')).data,
    });

    const subjects = useMemo(() => profile?.subjects || [], [profile]);
    const availability = useMemo(() => profile?.availability || [], [profile]);

    const slotsByDay = useMemo(() => {
        const map = {};
        availability.forEach((slot) => {
            map[slot.day] = (map[slot.day] || 0) + 1;
        });
        return map;
    }, [availability]);

    const activeDays = WEEK.filter((day) => slotsByDay[day.key]);

    if (isPending) {
        return <Loader></Loader>;
    }

    if (!profile) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}>
                <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                    Good to see you, {user?.displayName || 'tutor'} 👋
                </h1>
                <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
                    <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-500/10">
                        <User className="h-7 w-7 text-fuchsia-400" />
                    </motion.span>
                    <p className="mt-4 font-heading text-lg font-semibold text-white">Your tutor profile isn't set up yet</p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-400">
                        Students can't find or book you until it's complete. It only takes a minute.
                    </p>
                    <Link to="/dashboard/tutor/profile">
                        <motion.span
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25">
                            Complete your profile <ArrowRight className="h-4 w-4" />
                        </motion.span>
                    </Link>
                </div>
            </motion.div>
        );
    }

    const stats = [
        {
            icon: GraduationCap,
            label: 'Subjects',
            value: subjects.length,
            caption: 'Active subjects you teach',
            tone: {
                card: 'from-violet-500/12',
                icon: 'bg-violet-500/15 text-violet-300',
                chip: 'bg-violet-500/10 text-violet-300',
            },
            details: subjects.slice(0, 3),
            extra: subjects.length > 3 ? `+${subjects.length - 3}` : null,
            emptyHint: 'No subjects added yet',
        },
        {
            icon: DollarSign,
            label: 'Hourly rate',
            value: Number(profile.hourlyRate) || 0,
            prefix: '$',
            caption: 'What students pay per hour',
            tone: {
                card: 'from-amber-500/12',
                icon: 'bg-amber-500/15 text-amber-300',
                chip: 'bg-amber-500/10 text-amber-300',
            },
            details: profile.categoryName ? [profile.categoryName] : [],
            emptyHint: 'No category set',
        },
        {
            icon: CalendarClock,
            label: 'Weekly slots',
            value: availability.length,
            caption: 'Times students can book',
            tone: {
                card: 'from-sky-500/12',
                icon: 'bg-sky-500/15 text-sky-300',
                chip: 'bg-sky-500/10 text-sky-300',
            },
            details: activeDays.slice(0, 3).map((d) => d.short),
            extra: activeDays.length > 3 ? `+${activeDays.length - 3}` : null,
            emptyHint: 'No slots yet',
        },
    ];

    return (
        <div className="space-y-6">
            <DashboardHeader
                displayName={user?.displayName || 'tutor'}
                slotsByDay={slotsByDay}
                activeDays={activeDays}
            ></DashboardHeader>

            <motion.div
                variants={staggerContainer(0.09, 0.15)}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                    <TutorStatCard key={stat.label} {...stat} delay={0.2 + index * 0.09}></TutorStatCard>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}>
                <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wide text-slate-300">
                    <span className="h-4 w-1 rounded-full bg-linear-to-b from-fuchsia-400 to-purple-500" />
                    <BookOpen className="h-4 w-4 text-fuchsia-300" />
                    My Sessions
                </h2>
                <div className="mt-3">
                    <BookingsList perspective="tutor"></BookingsList>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
