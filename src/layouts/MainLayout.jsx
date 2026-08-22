import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ChatWidget from "../components/shared/ChatWidget";

const MainLayout = () => {
    return (
         <div className="bg-[#020921]">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            <ChatWidget></ChatWidget>
        </div>
    );
};

export default MainLayout;