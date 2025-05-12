import { Outlet } from "react-router-dom";
import TopBar from "../components/admin/TopBar";
import SideBar from "../components/admin/SideBar";
import '../index.css';

const AdminLayout = () => {
    return (
        <div className="bg-[var(--light-pink)] flex h-screen">
            {/* Sidebar cố định */}
            <div className="w-1/5 fixed top-0 left-0 h-screen z-10 p-3">
                <SideBar />
            </div>

            {/* Nội dung chính (phải đẩy sang bên phải tương ứng với sidebar) */}
            <div className="ml-[20%] flex flex-col flex-1 h-screen overflow-y-auto">
                <TopBar />
                <div className="p-5 py-3 flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
