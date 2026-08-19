import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import AuthContext from "@/provider/AuthContext";

const axiosSecure = axios.create({
    baseURL: API_BASE_URL,
});

const useAxiosSecure = () => {
    const { logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('access-token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    logoutUser().finally(() => navigate('/signin'));
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logoutUser, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
