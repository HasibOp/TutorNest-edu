import { Navigate } from "react-router-dom";
import useRole from "@/hooks/useRole";
import Loader from "@/components/shared/Loader";

const roleHome = {
    admin: "/dashboard/admin",
    tutor: "/dashboard/tutor",
    student: "/dashboard/student",
};

const DashboardHome = () => {
    const [role, isRoleLoading] = useRole();

    if (isRoleLoading) {
        return <Loader></Loader>;
    }

    return <Navigate to={roleHome[role] || "/"} replace></Navigate>;
};

export default DashboardHome;
