import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ban, GraduationCap, ListTree, ShieldCheck, Users } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";

const StatCard = ({ label, value, icon: Icon, tint }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
            <Icon className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: stats, isPending } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/stats');
            return res.data;
        },
    });

    if (isPending) {
        return <Loader></Loader>;
    }

    return (
        <div>
            <h1 className="text-4xl my-4 text-amber-100 font-bold">Good to see you, {user?.displayName || 'Admin'} 👋!</h1>
            <p className="mt-1 text-sm text-slate-400">Your learning community is taking shape. Here's your TutorNest snapshot for today.</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total users" value={stats.total} icon={Users} tint="bg-fuchsia-500/15 text-fuchsia-300" />
                <StatCard label="Students" value={stats.students} icon={GraduationCap} tint="bg-blue-500/15 text-blue-300" />
                <StatCard label="Tutors" value={stats.tutors} icon={ShieldCheck} tint="bg-amber-500/15 text-amber-300" />
                <StatCard label="Categories" value={stats.categories} icon={ListTree} tint="bg-orange-500/15 text-orange-300" />
                <StatCard label="Banned users" value={stats.banned} icon={Ban} tint="bg-red-500/15 text-red-400" />
            </div>
        </div>
    );
};

export default AdminDashboard;
