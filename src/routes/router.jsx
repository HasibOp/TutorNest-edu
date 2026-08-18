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
 {
    path: "*",
    element: <NotFound></NotFound>
  }
])