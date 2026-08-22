import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { Calendar, Layers, ListTree, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loader from "@/components/shared/Loader";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import { fadeUp, staggerContainer } from "@/lib/motion";

const emptyForm = { name: "", description: "" };
const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-400/60";

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
        setForm({ name: category.name, description: category.description || "" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const handleDelete = async (category) => {
        const confirm = await Swal.fire({
            title: `Delete "${category.name}"?`,
            text: 'Tutors will no longer be able to pick this subject.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            confirmButtonColor: '#e11d48',
            background: '#0b1020',
            color: '#e2e8f0',
        });
        if (!confirm.isConfirmed) return;
        deleteCategory(category._id);
    };

    if (isPending) {
        return <Loader></Loader>;
    }

    const isSaving = isCreating || isUpdating;
    const described = categories.filter((c) => c.description?.trim()).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                icon={ListTree}
                tone="emerald"
                title="Manage Categories"
                subtitle="The subjects tutors can teach and students can browse."
                stats={[
                    { label: 'Categories', value: categories.length, tone: 'emerald' },
                    { label: 'With a description', value: described, tone: 'slate' },
                ]}
            ></AdminPageHeader>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className={`rounded-2xl border p-5 transition-colors ${
                    editingId ? 'border-fuchsia-400/40 bg-fuchsia-500/5' : 'border-white/10 bg-white/5'
                }`}
            >
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                        {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                    <h2 className="text-sm font-semibold text-white">
                        {editingId ? 'Edit category' : 'Add a category'}
                    </h2>
                    <AnimatePresence>
                        {editingId && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-fuchsia-300"
                            >
                                Editing
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                    <div>
                        <label htmlFor="category-name" className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Tag className="h-3.5 w-3.5" /> Name
                        </label>
                        <input
                            id="category-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Mathematics"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="category-description" className="text-xs font-medium text-slate-400">
                            Description <span className="text-slate-500">(optional)</span>
                        </label>
                        <input
                            id="category-description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Short description students will see"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex gap-2">
                        <motion.button
                            type="submit"
                            disabled={isSaving}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Add category'}
                        </motion.button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                            >
                                <X className="h-4 w-4" /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            </motion.form>

            {categories.length === 0 ? (
                <EmptyState
                    icon={Layers}
                    title="No categories yet"
                    hint="Add your first subject above so tutors have something to teach."
                ></EmptyState>
            ) : (
                <motion.div
                    variants={staggerContainer(0.05, 0.15)}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                >
                    <AnimatePresence initial={false}>
                        {categories.map((category) => {
                            const isEditing = editingId === category._id;
                            return (
                                <motion.div
                                    key={category._id}
                                    layout
                                    variants={fadeUp}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    whileHover={{ y: -5 }}
                                    className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-colors ${
                                        isEditing
                                            ? 'border-fuchsia-400/50 bg-fuchsia-500/5'
                                            : 'border-white/10 bg-white/5 hover:border-white/25'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                                            <Tag className="h-5 w-5" />
                                        </span>

                                        <div className="flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(category)}
                                                aria-label={`Edit ${category.name}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-200 transition-colors hover:bg-white/20 hover:text-white"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(category)}
                                                aria-label={`Delete ${category.name}`}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300 transition-colors hover:bg-rose-500/30"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="mt-4 font-heading text-lg font-bold text-white">{category.name}</h3>
                                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-400">
                                        {category.description?.trim() || 'No description yet.'}
                                    </p>

                                    <p className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-xs text-slate-500">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Added {formatDate(category.createdAt)}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ManageCategories;
