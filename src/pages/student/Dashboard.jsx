import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "@/provider/AuthContext";
import BookingsList from "@/components/shared/BookingsList";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { ArrowRight, Calendar, Search, User } from "lucide-react";

const QUICK_ACTIONS = [
    {
        icon: Search,
        label: "Find a Tutor",
        desc: "Discover expert tutors and book a session.",
        to: "/tutors",
        tone: "from-fuchsia-500/20 to-purple-500/10 text-fuchsia-300 ring-fuchsia-400/25",
    },
    {
        icon: Calendar,
        label: "My Schedule",
        desc: "View your upcoming lessons and sessions.",
        anchor: "#my-bookings",
        tone: "from-sky-500/20 to-blue-500/10 text-sky-300 ring-sky-400/25",
    },
    {
        icon: User,
        label: "My Profile",
        desc: "Update your profile and preferences.",
        to: "/dashboard/student/profile",
        tone: "from-emerald-500/20 to-teal-500/10 text-emerald-300 ring-emerald-400/25",
    },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const handleAnchorClick = (e, anchor) => {
        e.preventDefault();
        document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                        Good to see you, {user?.displayName || "there"}
                        <motion.span
                            animate={{ rotate: [0, 18, -8, 18, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                            className="inline-block origin-[70%_70%]">
                            👋
                        </motion.span>
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-400">Here are your upcoming and past sessions.</p>
                </div>

                <Link to="/">
                    <motion.span
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 px-5 py-2.5 text-sm font-semibold text-fuchsia-300 transition-colors hover:bg-fuchsia-500/10">
                        Back to Home <ArrowRight className="h-4 w-4" />
                    </motion.span>
                </Link>
            </motion.div>

            <motion.div
                id="my-bookings"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="mt-8 scroll-mt-24">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">My Bookings</h2>
                <div className="mt-3">
                    <BookingsList perspective="student"></BookingsList>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quick Actions</h2>
                <motion.div
                    variants={staggerContainer(0.1, 0.1)}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {QUICK_ACTIONS.map(({ icon: Icon, label, desc, to, anchor, tone }) => {
                        const card = (
                            <motion.div
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20">
                                <div className="flex items-center justify-between">
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br ring-1 ring-inset ${tone}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                                </div>
                                <p className="mt-4 font-semibold text-white">{label}</p>
                                <p className="mt-1 text-sm text-slate-400">{desc}</p>
                            </motion.div>
                        );

                        return to ? (
                            <Link key={label} to={to}>{card}</Link>
                        ) : (
                            <a key={label} href={anchor} onClick={(e) => handleAnchorClick(e, anchor)}>{card}</a>
                        );
                    })}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
