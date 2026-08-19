import AuthContext from "@/provider/AuthContext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/shared/Loader";
const PrivateRoute = ({children}) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loader></Loader>
    }
    if (user) {
        return children;
    }
    return <Navigate to={"/signup"} state={{from: location}} replace></Navigate>;


};

export default PrivateRoute;