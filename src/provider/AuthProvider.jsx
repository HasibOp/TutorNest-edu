import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "@/firebase/firebase.config";
import AuthContext from "./AuthContext";


const googleAuthProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signUpUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const userUpdateProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    }

    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    }

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleAuthProvider);
    }

   
   useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser);
            setLoading(false);
        });
        return ()=>{
            unsubscribe();
        };
    }, []);

    const userInfo = {
        user,
        setUser,
        loading,
        signInUser,
        signUpUser,
        userUpdateProfile,
        logoutUser,
        signInWithGoogle
    }

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;