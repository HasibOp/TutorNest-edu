import { useContext, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { Ban, CheckCircle2, GraduationCap, Search, ShieldCheck, UserCog, Users, X } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import Avatar from "@/components/shared/Avatar";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { fadeUp, staggerContainer } from "@/lib/motion";

const ROLE_META = {
    student: { label: 'Student', icon: GraduationCap, pill: 'bg-sky-500/15 text-sky-300' },
    tutor: { label: 'Tutor', icon: ShieldCheck, pill: 'bg-amber-500/15 text-amber-300' },
    admin: { label: 'Admin', icon: UserCog, pill: 'bg-indigo-500/15 text-indigo-300' },
};

const ROLE_FILTERS = [
    { value: 'all', label: 'Everyone' },
    { value: 'student', label: 'Students' },
    { value: 'tutor', label: 'Tutors' },
    { value: 'admin', label: 'Admins' },
];

const STATUS_FILTERS = [
    { value: 'all', label: 'Any status' },
    { value: 'active', label: 'Active' },
    { value: 'banned', label: 'Banned' },
];

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user: currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: users = [], isPending } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const { mutate: toggleStatus } = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/users/${id}/status`, { status });
            return res.data;
        },
        onSuccess: (_data, variables) => {
            toast.success(variables.status === 'banned' ? 'User banned' : 'User reinstated');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
            toast.error('Failed to update user status');
        },
    });

    const counts = useMemo(() => ({
        total: users.length,
        students: users.filter((u) => (u.role || 'student') === 'student').length,
        tutors: users.filter((u) => u.role === 'tutor').length,
        admins: users.filter((u) => u.role === 'admin').length,
        banned: users.filter((u) => u.status === 'banned').length,
    }), [users]);

    const visibleUsers = useMemo(() => {
        const term = search.trim().toLowerCase();
        return users.filter((u) => {
            const role = u.role || 'student';
            if (roleFilter !== 'all' && role !== roleFilter) return false;
            if (statusFilter === 'banned' && u.status !== 'banned') return false;
            if (statusFilter === 'active' && u.status === 'banned') return false;
            if (!term) return true;
            return (
                String(u.name || '').toLowerCase().includes(term) ||
                String(u.email || '').toLowerCase().includes(term)
            );
        });
    }, [users, search, roleFilter, statusFilter]);

    const handleToggle = async (u) => {
        const isBanned = u.status === 'banned';
        if (!isBanned) {
            const confirm = await Swal.fire({
                title: `Ban ${u.name || u.email}?`,
                text: "They'll be signed out and blocked from using the platform.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, ban them',
                confirmButtonColor: '#e11d48',
                background: '#0b1020',
                color: '#e2e8f0',
            });
            if (!confirm.isConfirmed) return;
        }
        toggleStatus({ id: u._id, status: isBanned ? 'active' : 'banned' });
    };

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('all');
        setStatusFilter('all');
    };

    const hasFilters = Boolean(search.trim()) || roleFilter !== 'all' || statusFilter !== 'all';

    if (isPending) {
        return <Loader></Loader>;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={Users}
                tone="violet"
                title="Manage Users"
                subtitle="Review who's on the platform and control account access."
                stats={[
                    { label: 'Total', value: counts.total, tone: 'slate' },
                    { label: 'Students', value: counts.students, tone: 'sky' },
                    { label: 'Tutors', value: counts.tutors, tone: 'amber' },
                    { label: 'Admins', value: counts.admins, tone: 'indigo' },
                    { label: 'Banned', value: counts.banned, tone: 'rose' },
                ]}>
            </AdminPageHeader>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60"/>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <div className="flex flex-wrap gap-2">
                        {ROLE_FILTERS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRoleFilter(value)}
                                aria-pressed={roleFilter === value}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    roleFilter === value
                                        ? 'bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/20'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    <span className="hidden h-5 w-px bg-white/10 sm:block" />

                    <div className="flex flex-wrap gap-2">
                        {STATUS_FILTERS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setStatusFilter(value)}
                                aria-pressed={statusFilter === value}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    statusFilter === value
                                        ? 'bg-white/15 text-white ring-1 ring-white/25'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                            {visibleUsers.length} of {users.length}
                        </span>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-fuchsia-300 transition-colors hover:text-fuchsia-200">
                                <X className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {visibleUsers.length === 0 ? (
                <EmptyState
                    icon={Search}
                    title="No users match those filters"
                    hint="Try a different name, role, or status."
                    action={
                        hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white">
                                Clear filters
                            </button>
                        )}
                ></EmptyState>
            ) : (
                <motion.div
                    key={`${roleFilter}-${statusFilter}-${search}`}
                    variants={staggerContainer(0.05, 0.05)}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2.5">
                    <AnimatePresence initial={false}>
                        {visibleUsers.map((u) => {
                            const role = u.role || 'student';
                            const meta = ROLE_META[role] || ROLE_META.student;
                            const RoleIcon = meta.icon;
                            const isBanned = u.status === 'banned';
                            const isSelf = u.email === currentUser?.email;

                            return (
                                <motion.div
                                    key={u._id}
                                    layout
                                    variants={fadeUp}
                                    exit={{ opacity: 0, y: -8 }}
                                    whileHover={{ y: -3 }}
                                    className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                                        isBanned
                                            ? 'border-rose-500/25 bg-rose-500/5 hover:border-rose-500/40'
                                            : 'border-white/10 bg-white/5 hover:border-white/25'
                                    }`}>
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        <Avatar name={u.name || u.email} src={u.photo}></Avatar>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate font-semibold text-white">{u.name || 'Unnamed'}</p>
                                                {isSelf && (
                                                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <p className="truncate text-xs text-slate-400">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.pill}`}>
                                            <RoleIcon className="h-3.5 w-3.5" />
                                            {meta.label}
                                        </span>

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                isBanned
                                                    ? 'bg-rose-500/15 text-rose-300'
                                                    : 'bg-emerald-500/15 text-emerald-300'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${isBanned ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                            {isBanned ? 'Banned' : 'Active'}
                                        </span>

                                        <motion.button
                                            type="button"
                                            disabled={isSelf}
                                            whileHover={isSelf ? undefined : { scale: 1.05 }}
                                            whileTap={isSelf ? undefined : { scale: 0.95 }}
                                            onClick={() => handleToggle(u)}
                                            title={isSelf ? "You can't change your own status" : undefined}
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                                isBanned
                                                    ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                                                    : 'bg-white/10 text-white hover:bg-rose-500/20 hover:text-rose-300'
                                            }`}>
                                            {isBanned ? (
                                                <>
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Unban
                                                </>
                                            ) : (
                                                <>
                                                    <Ban className="h-3.5 w-3.5" /> Ban
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ManageUsers;
