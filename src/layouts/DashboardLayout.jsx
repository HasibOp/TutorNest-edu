import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, LayoutDashboard, ListTree, Menu, User, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useRole from "@/hooks/useRole";
import Loader from "@/components/shared/Loader";

const linksByRole = {
    admin: [
        { label: "Overview", to: "/dashboard/admin", icon: LayoutDashboard, end: true },
        { label: "Manage Users", to: "/dashboard/admin/users", icon: Users },
        { label: "Manage Categories", to: "/dashboard/admin/categories", icon: ListTree },
    ],
    tutor: [
        { label: "Overview", to: "/dashboard/tutor", icon: LayoutDashboard, end: true },
        { label: "Profile", to: "/dashboard/tutor/profile", icon: User },
    ],
    student: [
        { label: "Overview", to: "/dashboard/student", icon: LayoutDashboard, end: true },
        { label: "Profile", to: "/dashboard/student/profile", icon: User },
    ],
};

const DashboardLayout = () => {
    const [role, isRoleLoading] = useRole();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (isRoleLoading) {
        return <Loader></Loader>;
    }

    const links = linksByRole[role] || [];

    return (
        <div className="flex min-h-screen bg-[#020921]">
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-[#030c2d] transition-transform lg:static lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_14px_rgba(217,70,239,0.45)]">
                        <BookOpen className="h-5 w-5 text-white" strokeWidth={2.4} />
                    </span>
                    <span className="text-lg font-bold text-white">
                        TutorNest<span className="text-fuchsia-400">-edu</span>
                    </span>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                    {role && (
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {role} panel
                        </p>
                    )}
                    {links.map(({ label, to, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
                                    isActive && "bg-white/10 text-white"
                                )}>
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"/>
            )}

            <div className="flex min-h-screen flex-1 flex-col">
                <header className="flex h-16 items-center border-b border-white/10 px-4 lg:hidden">
                    <button
                        type="button"
                        aria-label="Toggle sidebar"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-white/10">
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet></Outlet>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
