import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "@/provider/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: role = null, isPending: isRoleLoading } = useQuery({
        queryKey: ['role', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data.role;
        },
    });

    return [role, loading || isRoleLoading];
};

export default useRole;
