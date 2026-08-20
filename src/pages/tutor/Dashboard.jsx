import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarClock, DollarSign, GraduationCap, User } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";

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
                <h1 className="text-2xl font-bold text-white">Welcome, {user?.displayName || 'tutor'}!</h1>
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
            <h1 className="lg:text-6xl text-3xl font-bold text-amber-400 mt-10">Good to see you, {user?.displayName || 'tutor'}!</h1>
            <p className="text-amber-50 mt-4">Manage your lessons, connect with students, and keep your teaching journey moving forward!</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <GraduationCap className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-sm font-medium">Subjects</span>
                    </div>
                    <p className="mt-3 text-3xl font-semibold text-white">{profile.subjects?.length || 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-sm font-medium">Hourly rate</span>
                    </div>
                    <p className="mt-3 text-3xl font-semibold text-white">${profile.hourlyRate || 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CalendarClock className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-sm font-medium">Weekly slots</span>
                    </div>
                    <p className="mt-3 text-3xl font-semibold text-white">{profile.availability?.length || 0}</p>
                </div>
            </div>

            <Link
                to="/dashboard/tutor/profile"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15">
                Edit profile
            </Link>
        </div>
    );
};

export default Dashboard;
