import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Ban, CheckCircle2 } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user: currentUser } = useContext(AuthContext);

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
        onSuccess: () => {
            toast.success('User status updated');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
            toast.error('Failed to update user status');
        },
    });

    if (isPending) {
        return <Loader></Loader>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            <p className="mt-1 text-sm text-slate-400">{users.length} total users</p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {users.map((u) => {
                            const isBanned = u.status === 'banned';
                            const isSelf = u.email === currentUser?.email;
                            return (
                                <tr key={u._id} className="text-slate-200">
                                    <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                                    <td className="px-4 py-3 capitalize">{u.role || 'student'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                isBanned
                                                    ? 'bg-red-500/15 text-red-400'
                                                    : 'bg-emerald-500/15 text-emerald-400'
                                            }`}>
                                            {isBanned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            disabled={isSelf}
                                            onClick={() =>
                                                toggleStatus({ id: u._id, status: isBanned ? 'active' : 'banned' })
                                            }
                                            title={isSelf ? "You can't change your own status" : undefined}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40">
                                            {isBanned ? (
                                                <>
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Unban
                                                </>
                                            ) : (
                                                <>
                                                    <Ban className="h-3.5 w-3.5" />
                                                    Ban
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
