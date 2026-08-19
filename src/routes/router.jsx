import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import NotFound from "../pages/NotFound/NotFound";
import Contact from "@/pages/Contact/Contact";
import About from "@/pages/About/About";
import Tutors from "@/pages/Tutors/Tutors";
import Courses from "@/pages/Courses/Courses";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/layouts/DashboardHome";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageCategories from "@/pages/admin/ManageCategories";
import StudentDashboard from "@/pages/Student/Dashboard";
import StudentProfile from "@/pages/Student/Profile";
import TutorDashboard from "@/pages/Tutor/Dashboard";
import TutorProfile from "@/pages/Tutor/Profile";

export const router = createBrowserRouter ([ 
{
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
        {
            path: "/",
            element: <Home></Home>
        },
        {
            path: "/contact",
            element: <Contact></Contact>
        },
        {
            path: "/about",
            element: <About></About>
        },
        {
            path: "/tutors",
            element: <Tutors></Tutors>
        },
        {
            path: "/courses",
            element: <Courses></Courses>
        },
        {
        path: '/signin',
        element: <Login></Login>
       },
       {
        path: '/signup',
        element: <Signup></Signup>
       }
    ]
},

//---------dashboard layout------//
{
    path: "dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
        {
            index: true,
            element: <DashboardHome></DashboardHome>
        },

        //---------admin routes------//
        {
            path: "admin",
            element: <AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
        },
        {
            path: "admin/users",
            element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
        },
        {
            path: "admin/categories",
            element: <AdminRoute><ManageCategories></ManageCategories></AdminRoute>
        },

        //---------student routes------//
        {
            path: "student",
            element: <StudentDashboard></StudentDashboard>
        },
        {
            path: "student/profile",
            element: <StudentProfile></StudentProfile>
        },

        //---------tutor routes------//
        {
            path: "tutor",
            element: <TutorDashboard></TutorDashboard>
        },
        {
            path: "tutor/profile",
            element: <TutorProfile></TutorProfile>
        },
    ]
},

 {
    path: "*",
    element: <NotFound></NotFound>
  }
])