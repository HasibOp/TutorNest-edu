import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";

const emptyForm = { name: "", description: "",};
const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

const ManageCategories = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const { data: categories = [], isPending } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosSecure.get('/categories');
            return res.data;
        },
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] });

    const { mutate: createCategory, isPending: isCreating } = useMutation({
        mutationFn: async (payload) => (await axiosSecure.post('/categories', payload)).data,
        onSuccess: () => {
            toast.success('Category created');
            setForm(emptyForm);
            invalidate();
        },
        onError: () => toast.error('Failed to create category'),
    });

    const { mutate: updateCategory, isPending: isUpdating } = useMutation({
        mutationFn: async ({ id, payload }) => (await axiosSecure.patch(`/categories/${id}`, payload)).data,
        onSuccess: () => {
            toast.success('Category updated');
            setForm(emptyForm);
            setEditingId(null);
            invalidate();
        },
        onError: () => toast.error('Failed to update category'),
    });

    const { mutate: deleteCategory } = useMutation({
        mutationFn: async (id) => (await axiosSecure.delete(`/categories/${id}`)).data,
        onSuccess: () => {
            toast.success('Category deleted');
            invalidate();
        },
        onError: () => toast.error('Failed to delete category'),
    });

    const startEdit = (category) => {
        setEditingId(category._id);
        setForm({ name: category.name, description: category.description || ""});
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        if (editingId) {
            updateCategory({ id: editingId, payload: form });
        } else {
            createCategory(form);
        }
    };

    if (isPending) {
        return <Loader></Loader>;
    }

    const isSaving = isCreating || isUpdating;

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
            <p className="mt-1 text-sm text-slate-400">{categories.length} total categories</p>

            <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="min-w-40 flex-1">
                    <label className="text-xs font-medium text-slate-400">Name</label>
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Mathematics"
                        required
                        className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60"
                    />
                </div>
                <div className="min-w-60 flex-2">
                    <label className="text-xs font-medium text-slate-400">Description</label>
                    <input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Optional short description"
                        className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-linear-to-r from-fuchsia-500 to-purple-600 px-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50">
                        <Plus className="h-4 w-4" />
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/15">
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {categories.map((category) => (
                            <tr key={category._id} className="text-slate-200">
                                <td className="px-4 py-3 font-medium">
                                   {category.name}
                                </td>
                                <td className="px-4 py-3 text-slate-400">{category.description || '—'}</td>
                                <td className="px-4 py-3 text-slate-400">{formatDate(category.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(category)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteCategory(category._id)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCategories;
