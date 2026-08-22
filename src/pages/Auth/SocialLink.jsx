import useAxiosPublic from '@/hooks/useAxiosPublic';
import AuthContext from '@/provider/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import RoleModal from './RoleModal';



const SocialLink = () => {
    const { signInWithGoogle, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const [pendingUser, setPendingUser] = useState(null);
    const [isSubmittingRole, setIsSubmittingRole] = useState(false);

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(async (res) => {
                const user = res.user;
                const userInfoInDB = {
                    email: user.email,
                    photo: user.photoURL,
                    name: user.displayName,
                    role: null,
                };
                const dbRes = await axiosPublic.post('/users', userInfoInDB);

                if (dbRes.data.alreadyExists) {
                    setUser(user);
                    navigate("/");
                } else {
                    setPendingUser(user);
                }
            })
            .catch(() => {
                toast.error('Google sign-in failed');
            });
    }

    const handleRoleSelect = async (role) => {
        setIsSubmittingRole(true);
        try {
            const tokenRes = await axiosPublic.post('/jwt', { email: pendingUser.email });
            if (tokenRes.data.token) {
                localStorage.setItem('access-token', tokenRes.data.token);
            }
            await axiosPublic.patch('/users/role', { email: pendingUser.email, role }, {
                headers: { authorization: `Bearer ${tokenRes.data.token}` },
            });
            setUser(pendingUser);
            Swal.fire({
                title: `Welcome, ${pendingUser.displayName}!`,
                text: "Successfully signed up! Let's get started!!!",
                icon: "success",
                draggable: true
            });
            navigate("/");
        } catch {
            toast.error('Failed to save your role, please try again');
        } finally {
            setIsSubmittingRole(false);
            setPendingUser(null);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-center gap-3 my-4">
                <div className="grow border-t border-white/40"></div>
                <span className="text-xs font-medium text-slate-500">OR</span>
                <div className="grow border-t border-white/40"></div>
            </div>
            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                type="button"
                className="cursor-pointer w-full rounded-2xl py-3 flex justify-center items-center gap-2 shadow-sm transition-colors border border-white/10 bg-white/5 text-white hover:bg-white/10">
                <FaGoogle size={18}></FaGoogle> Continue with Google
            </motion.button>

            {pendingUser && (
                <RoleModal onSelect={handleRoleSelect} isSubmitting={isSubmittingRole}></RoleModal>
            )}
        </div>
    );
};

export default SocialLink;
