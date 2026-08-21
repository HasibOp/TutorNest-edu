import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarClock, DollarSign, GraduationCap, User } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import BookingsList from "@/components/shared/BookingsList";

const Dashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: profile, isPending } = useQuery({
        queryKey: ['tutor-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/tutor-profiles/me')).data,
    });

    if (isPending) {
        return <Loader></Loader>;
    }

    if (!profile) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-amber-100">Good to see you, {user?.displayName || 'tutor'}👋!</h1>
                <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
                    <User className="mx-auto h-8 w-8 text-fuchsia-400" />
                    <p className="mt-3 text-sm text-slate-300">
                        You haven't set up your tutor profile yet. Students can't find or book you until it's complete.
                    </p>
                    <Link
                        to="/dashboard/tutor/profile"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
                        Complete your profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Good to see you, {user?.displayName || 'tutor'}👋!</h1>
            <p className="mt-1 text-sm text-slate-400">Manage your lessons and keep your teaching journey moving forward.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300">
                        <GraduationCap className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-slate-400">Subjects</p>
                    <p className="mt-1 text-3xl font-semibold text-white">{profile.subjects?.length || 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                        <DollarSign className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-slate-400">Hourly rate</p>
                    <p className="mt-1 text-3xl font-semibold text-white">${profile.hourlyRate || 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                        <CalendarClock className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-slate-400">Weekly slots</p>
                    <p className="mt-1 text-3xl font-semibold text-white">{profile.availability?.length || 0}</p>
                </div>
            </div>

            <Link
                to="/dashboard/tutor/profile"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15">
                Edit profile
            </Link>

            <h2 className="mt-8 text-sm font-semibold text-white">My Sessions</h2>
            <div className="mt-3">
                <BookingsList perspective="tutor"></BookingsList>
            </div>
        </div>
    );
};

export default Dashboard;
