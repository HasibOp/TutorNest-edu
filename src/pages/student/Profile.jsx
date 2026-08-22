import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, Image, Mail, Pencil, Send, ShieldCheck, Sparkles, User, Zap, Bell, Heart } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import auth from "@/firebase/firebase.config";

const inputClass = "mt-1 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-fuchsia-400/60";

const TRUST_BADGES = [
    { icon: ShieldCheck, label: "Secure", desc: "Your data is safe with us." },
    { icon: Zap, label: "Easy Updates", desc: "Update your info anytime." },
    { icon: Bell, label: "Stay Notified", desc: "Get important updates instantly." },
    { icon: Heart, label: "Your Journey", desc: "Every step brings you closer." },
];

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

    const focusPhotoField = () => {
        document.getElementById('photo-url-field')?.focus();
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <h1 className="text-2xl font-bold text-white sm:text-3xl">My Profile</h1>
                <p className="mt-1.5 text-sm text-slate-400">Update your details and keep your profile up to date.</p>
                <span className="mt-3 block h-1 w-10 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600" />

                <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -top-2 right-2 hidden text-fuchsia-400/70 sm:block"
                >
                    <Send className="h-7 w-7 -rotate-12" />
                </motion.div>
                <Sparkles className="pointer-events-none absolute right-16 top-6 hidden h-3.5 w-3.5 text-amber-300/70 sm:block" />
                <Sparkles className="pointer-events-none absolute right-24 -top-1 hidden h-2.5 w-2.5 text-fuchsia-300/60 sm:block" />
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:grid-cols-[220px_1fr]"
            >
                <div className="flex flex-col items-center border-white/10 text-center lg:border-r lg:pr-6">
                    <div className="relative">
                        <span className="block h-24 w-24 overflow-hidden rounded-full ring-4 ring-fuchsia-500/30">
                            <img
                                src={photo || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
                                alt={name || "You"}
                                className="h-full w-full object-cover"
                            />
                        </span>
                        <motion.button
                            type="button"
                            onClick={focusPhotoField}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Edit photo"
                            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg ring-2 ring-[#020921]"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </motion.button>
                    </div>

                    <p className="mt-4 text-lg font-bold text-white">{name || "Your name"}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-300">
                        <GraduationCap className="h-3.5 w-3.5" /> Student
                    </span>

                    <div className="mt-5 w-full border-t border-dashed border-white/10 pt-4">
                        <p className="text-sm italic text-slate-400">
                            "Learning today, leading tomorrow."
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <User className="h-3.5 w-3.5" /> Full name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Image className="h-3.5 w-3.5" /> Photo URL
                        </label>
                        <input
                            id="photo-url-field"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Mail className="h-3.5 w-3.5" /> Email
                        </label>
                        <input value={user?.email || ""} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-transform disabled:opacity-50">
                        {isPending ? (
                            "Saving..."
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Save Changes
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-4"
            >
                {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-inset ring-fuchsia-400/20">
                            <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{label}</p>
                            <p className="mt-0.5 text-xs leading-snug text-slate-400">{desc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Profile;
