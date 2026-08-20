import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@/provider/AuthContext";
import BookingsList from "@/components/shared/BookingsList";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.displayName || 'there'}!</h1>
            <p className="mt-1 text-sm text-slate-400">Here are your upcoming and past sessions.</p>

            <div className="mt-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">My Bookings</h2>
                <Link
                    to="/tutors"
                    className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                    Browse Tutors
                </Link>
            </div>

            <div className="mt-3">
                <BookingsList perspective="student"></BookingsList>
            </div>
        </div>
    );
};

export default Dashboard;
