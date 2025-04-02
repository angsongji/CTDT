import { Outlet } from "react-router-dom";
import TopBar from "../components/admin/TopBar";
import SideBar from "../components/admin/SideBar";
import '../index.css';
const AdminLayout = () => {
    return (
        <div className="bg-[var(--light-pink)] flex h-screen">
            <div className="w-1/5 flex justify-center items-center p-3 pr-0 ">
                <SideBar />
            </div>
            <div className="flex-1">
                <TopBar />
                <div className="p-5 py-3">
                    <Outlet />
                </div>


            </div>

        </div>


    );
};

export default AdminLayout;
