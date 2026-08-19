import { useQuery } from "@tanstack/react-query";
import { Ban, GraduationCap, ListTree, ShieldCheck, Users } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";

const StatTile = ({ label, value, icon: Icon }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 text-slate-400">
            <Icon className="h-4 w-4 text-fuchsia-400" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

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
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <p className="mt-1 text-sm text-slate-400">Platform statistics at a glance</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatTile label="Total users" value={stats.total} icon={Users} />
                <StatTile label="Students" value={stats.students} icon={GraduationCap} />
                <StatTile label="Tutors" value={stats.tutors} icon={ShieldCheck} />
                <StatTile label="Categories" value={stats.categories} icon={ListTree} />
                <StatTile label="Banned users" value={stats.banned} icon={Ban} />
            </div>
        </div>
    );
};

export default AdminDashboard;
