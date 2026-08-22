import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, ChevronRight, Compass, FolderPlus, Users, Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/motion";

const QUICK_ACTIONS = [
    {
        icon: Users,
        label: "Manage Users",
        desc: "Review roles and access",
        to: "/dashboard/admin/users",
        tone: "bg-violet-500/15 text-violet-300",
    },
    {
        icon: FolderPlus,
        label: "Add Category",
        desc: "Create a new subject",
        to: "/dashboard/admin/categories",
        tone: "bg-emerald-500/15 text-emerald-300",
    },
    {
        icon: CalendarClock,
        label: "View Bookings",
        desc: "Manage all sessions",
        to: "/dashboard/admin/bookings",
        tone: "bg-amber-500/15 text-amber-300",
    },
    {
        icon: Compass,
        label: "Browse Tutors",
        desc: "See the student's view",
        to: "/tutors",
        tone: "bg-sky-500/15 text-sky-300",
    },
];

const QuickActions = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-300">
                    <Zap className="h-4 w-4" />
                </span>
                <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
            </div>

            <motion.div
                variants={staggerContainer(0.07, 0.55)}
                initial="hidden"
                animate="visible"
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {QUICK_ACTIONS.map(({ icon: Icon, label, desc, to, tone }) => (
                    <motion.div key={label} variants={fadeUp}>
                        <Link
                            to={to}
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/10">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">{label}</p>
                                <p className="truncate text-xs text-slate-400">{desc}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default QuickActions;
