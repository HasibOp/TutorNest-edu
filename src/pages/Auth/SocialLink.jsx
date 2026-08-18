import useAxiosPublic from '@/hooks/useAxiosPublic';
import AuthContext from '@/provider/AuthContext';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";



const SocialLink = () => {
    const { signInWithGoogle, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();


        const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(res => {
                const user = res.user;
                const userInfoInDB =
                {
                    email: res.user?.email,
                    photo: res.user?.photoURL,
                    name: res.user?.displayName,
                    role: "user"
                };
                axiosPublic.post('/users', userInfoInDB)
                    .then(() => {
                        setUser(user);
                        navigate("/");
                    })
            })
    }

    return (
        <div>
            <div className="flex items-center justify-center gap-3 my-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="text-xs font-medium text-slate-500">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>
            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                type="button"
                className="w-full border border-white/10 bg-white/5 rounded-full py-2.5 flex justify-center items-center gap-2 text-white shadow-sm transition-colors hover:bg-white/10">
                <FaGoogle size={18}></FaGoogle> Continue with Google
            </motion.button>
        </div>
    );
};

export default SocialLink;