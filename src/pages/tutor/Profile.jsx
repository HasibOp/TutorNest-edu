import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Trash2, X } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const emptySlot = { day: "Monday", startTime: "09:00", endTime: "10:00" };
const inputClass = "mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60";

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);

    const [categoryId, setCategoryId] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [subjectInput, setSubjectInput] = useState("");
    const [bio, setBio] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [availability, setAvailability] = useState([]);

    const { data: profile, isPending: isProfilePending } = useQuery({
        queryKey: ['tutor-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/tutor-profiles/me')).data,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await axiosSecure.get('/categories')).data,
    });

    useEffect(() => {
        if (profile) {
            setCategoryId(profile.categoryId || "");
            setSubjects(profile.subjects || []);
            setBio(profile.bio || "");
            setHourlyRate(profile.hourlyRate || "");
            setAvailability(profile.availability || []);
        }
    }, [profile]);

    const { mutate: saveProfile, isPending: isSaving } = useMutation({
        mutationFn: async (payload) => (await axiosSecure.put('/tutor-profiles/me', payload)).data,
        onSuccess: () => {
            toast.success('Profile saved');
            queryClient.invalidateQueries({ queryKey: ['tutor-profile', user?.email] });
        },
        onError: () => toast.error('Failed to save profile'),
    });


    const addSubject = () => {
        const value = subjectInput.trim();
        if (value && !subjects.includes(value)) {
            setSubjects([...subjects, value]);
        }
        setSubjectInput("");
    };
    const removeSubject = (subject) => {
        setSubjects(subjects.filter((s) => s !== subject));
    };

    const addSlot = () => setAvailability([...availability, { ...emptySlot }]);
    const updateSlot = (index, field, value) => {
        setAvailability(availability.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    };
    const removeSlot = (index) => setAvailability(availability.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        saveProfile({ categoryId, subjects, bio, hourlyRate, availability });
    };

    if (isProfilePending) {
        return <Loader></Loader>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">Tutor Profile</h1>
            <p className="mt-1 text-sm text-slate-400">Keep your profile up to date so students can find you.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium text-slate-400">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className={inputClass}>
                                <option value="" disabled className="bg-[#0a1130] text-white">Select a category</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id} className="bg-[#0a1130] text-white">{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400">Hourly rate (USD)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(e.target.value)}
                                placeholder="25"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-medium text-slate-400">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell students about your teaching experience..."
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-medium text-slate-400">Subjects</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                value={subjectInput}
                                onChange={(e) => setSubjectInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSubject();
                                    }
                                }}
                                placeholder="e.g. Algebra, press Enter to add"
                                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60"/>
                            <button
                                type="button"
                                onClick={addSubject}
                                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/15">
                                <Plus className="h-4 w-4" />
                                Add
                            </button>
                        </div>
                        {subjects.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {subjects.map((subject) => (
                                    <span
                                        key={subject}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-medium text-fuchsia-300">
                                        {subject}
                                        <button type="button" onClick={() => removeSubject(subject)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-white">Weekly availability</label>
                        <button
                            type="button"
                            onClick={addSlot}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                            <Plus className="h-3.5 w-3.5" />
                            Add slot
                        </button>
                    </div>

                    {availability.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">No availability slots yet.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {availability.map((slot, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-2">
                                    <select
                                        value={slot.day}
                                        onChange={(e) => updateSlot(index, 'day', e.target.value)}
                                        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-fuchsia-400/60">
                                        {days.map((day) => (
                                            <option key={day} value={day} className="bg-[#0a1130] text-white">{day}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                                        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-fuchsia-400/60"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                                        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-fuchsia-400/60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(index)}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
