import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import auth from "@/firebase/firebase.config";

const inputClass = "mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60";

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user, userUpdateProfile, setUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.displayName || "");
    const [photo, setPhoto] = useState(user?.photoURL || "");

    const { mutate: saveProfile, isPending } = useMutation({
        mutationFn: async () => {
            await userUpdateProfile({ displayName: name, photoURL: photo });
            await axiosSecure.patch('/users/me', { name, photo });
        },
        onSuccess: () => {
            setUser({ ...auth.currentUser });
            toast.success('Profile updated');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => toast.error('Failed to update profile'),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        saveProfile();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="mt-1 text-sm text-slate-400">Update your name and photo.</p>

            <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
                <img
                    src={photo || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
                    alt={name || "You"}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
                />

                <div>
                    <label className="text-xs font-medium text-slate-400">Full name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-400">Photo URL</label>
                    <input
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        placeholder="https://..."
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-400">Email</label>
                    <input value={user?.email || ""} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
