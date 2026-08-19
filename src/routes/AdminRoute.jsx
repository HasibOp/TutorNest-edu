import AuthContext from "@/provider/AuthContext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import useRole from "@/hooks/useRole";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [role, isRoleLoading] = useRole();
    const location = useLocation();

    if (loading || isRoleLoading) {
        return <Loader></Loader>;
    }
    if (user && role === 'admin') {
        return children;
    }
    return <Navigate to={"/"} state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
