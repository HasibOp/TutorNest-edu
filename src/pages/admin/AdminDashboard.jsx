import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Ban, Calendar, GraduationCap, ListTree, ShieldCheck, UserCog, Users } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import UserSplitDonut from "@/components/admin/UserSplitDonut";
import StatCard from "@/components/admin/StatCard";
import QuickActions from "@/components/admin/QuickActions";
import { staggerContainer } from "@/lib/motion";

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: stats, isPending, isError } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users/stats');
            return res.data;
        },
    });

    if (isPending) {
        return <Loader></Loader>;
    }

    if (isError || !stats) {
        return (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                <Ban className="mx-auto h-8 w-8 text-rose-400" />
                <p className="mt-3 text-sm text-slate-300">We couldn't load your stats. Refresh to try again.</p>
            </div>
        );
    }

    const total = stats.total || 0;
    const shareOf = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);
    const assigned = (stats.students || 0) + (stats.tutors || 0) + (stats.admins || 0);
    const unassigned = Math.max(total - assigned, 0);

    const donutSegments = [
        { label: 'Students', value: stats.students || 0, color: '#38bdf8' },
        { label: 'Tutors', value: stats.tutors || 0, color: '#fbbf24' },
        { label: 'Admins', value: stats.admins || 0, color: '#818cf8' },
        { label: 'No role yet', value: unassigned, color: '#64748b' },
    ].filter((segment) => segment.value > 0);

    const cards = [
        { icon: Users, label: "Total Users", value: total, sub: "All registered users", subIcon: Users, share: null, tone: "violet" },
        { icon: GraduationCap, label: "Students", value: stats.students || 0, sub: "Learning on the platform", subIcon: GraduationCap, share: shareOf(stats.students || 0), tone: "sky" },
        { icon: ShieldCheck, label: "Tutors", value: stats.tutors || 0, sub: "Teaching on the platform", subIcon: ShieldCheck, share: shareOf(stats.tutors || 0), tone: "amber" },
        { icon: UserCog, label: "Admins", value: stats.admins || 0, sub: "With full admin access", subIcon: UserCog, share: shareOf(stats.admins || 0), tone: "indigo" },
        { icon: ListTree, label: "Categories", value: stats.categories || 0, sub: "Subjects tutors can teach", subIcon: ListTree, share: null, tone: "emerald" },
        { icon: Ban, label: "Banned Users", value: stats.banned || 0, sub: "Restricted accounts", subIcon: Ban, share: shareOf(stats.banned || 0), tone: "rose" },
    ];

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300">
                    <Calendar className="h-4 w-4 text-fuchsia-300" />
                    {today}
                </span>
            </motion.div>

            <div className="relative mt-4 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-fuchsia-500/10 via-transparent to-violet-500/10 px-6 py-7 sm:px-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[110px]"
                        animate={{ x: [0, 30, 0], y: [0, 18, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-[110px]"
                        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}>
                        <h1 className="flex flex-wrap items-center gap-x-2 font-heading text-3xl font-bold text-white sm:text-4xl">
                            Good to see you,
                            <span className="bg-linear-to-r from-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
                                {user?.displayName || 'Admin'}
                            </span>
                            <motion.span
                                animate={{ rotate: [0, 18, -8, 18, 0] }}
                                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                                className="inline-block origin-[70%_70%]">
                                👋
                            </motion.span>
                        </h1>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                            Your learning community is taking shape. Here's your TutorNest snapshot for today.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
                        className="flex items-center gap-5">
                        <UserSplitDonut segments={donutSegments} total={total}></UserSplitDonut>

                        <ul className="space-y-2">
                            {donutSegments.map((segment) => (
                                <li key={segment.label} className="flex items-center gap-2 text-xs">
                                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                                    <span className="text-slate-400">{segment.label}</span>
                                    <span className="font-semibold text-white">{segment.value}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            <motion.div
                variants={staggerContainer(0.08, 0.15)}
                initial="hidden"
                animate="visible"
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                    <StatCard key={card.label} {...card} delay={0.2 + index * 0.08}></StatCard>
                ))}
            </motion.div>
            <QuickActions></QuickActions>
        </div>
    );
};

export default AdminDashboard;
