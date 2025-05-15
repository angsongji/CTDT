import { RiMindMap } from "react-icons/ri";
import { MdOutlineSchool } from "react-icons/md";
import { NavLink, useLocation  } from "react-router-dom";
import { LuFrame } from "react-icons/lu";
import { IoIosInformationCircleOutline, IoIosList  } from "react-icons/io";
import { SiCoursera } from "react-icons/si";
import { IoAlbumsOutline } from "react-icons/io5";
import { GrPlan, GrCycle } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { PiMouseScroll } from "react-icons/pi";
import React from "react";
import "../../index.css";

const list_chucnang = [
    {
        name: "Ngành đào tạo",
        path: "/admin/faculty",
        icon: MdOutlineSchool,
    },
    {
        name: "Các khối kiến thức",
        path: "/admin/knowledge-areas",
        icon: RiMindMap,
    },
    {
        name: "Khung chương trình",
        path: "/admin/curriculum-framework",
        icon: LuFrame,
    },
    {
        name: "Thông tin chung",
        path: "/admin/general-information",
        icon: IoIosInformationCircleOutline,
    },
    {
        name: "Học phần",
        path: "/admin/course",
        icon: SiCoursera,
    },
    {
        name: "Danh mục học phần",
        path: "/admin/course-list",
        icon: IoIosList ,
    },
    {
        name: "Đề cương chi tiết",
        path: "/admin/course-outline",
        icon: IoAlbumsOutline ,
    },
    {
        name: "Kế hoạch dạy học",
        path: "/admin/teaching-plan",
        icon: GrPlan ,
    },
    {
        name: "Giảng viên",
        path: "/admin/lecturer",
        icon: FaChalkboardTeacher ,
    },
    {
        name: "Kế hoạch mở nhóm",
        path: "/admin/group-opening-plan",
        icon: FaLayerGroup ,
    },
    {
        name: "Phân công giảng dạy",
        path: "/admin/teaching-assignment",
        icon: MdOutlineAssignmentInd ,
    },
    {
        name: "Chu kỳ đào tạo",
        path: "/admin/training-cycle",
        icon: GrCycle ,
    },

    
    
    
];

function SideBar() {
    const location = useLocation();

    const Component = ({ chucnang }) => {
        const isActive = location.pathname === chucnang.path || location.pathname.startsWith(`${chucnang.path}/`);

        return (
            <NavLink
                to={chucnang.path}
                className={`transition-all duration-200 flex items-center gap-3 p-2 w-full font-bold pl-4 ${
                    isActive
                        ? "active text-white"
                        : "hover:border-r-5 hover:border-[var(--light-pink)] text-[var(--medium-pink)]"
                }`}
            >
                <span className={`text-2xl ${isActive ? "text-white" : "text-[var(--medium-pink)]"}`}>
                    {React.createElement(chucnang.icon)}
                </span>
                <span className="text-base">{chucnang.name}</span>
            </NavLink>
        );
    };

    return (
        <div className="w-full h-full bg-[var(--dark-pink)] rounded-4xl flex items-center gap-10 flex-col">
            <img src="/logoSGU.png" alt="logo" className="w-[55%] object-cover mt-10" />
            <div className="menu-container w-full h-2/3 flex flex-col gap-2">
                {list_chucnang.map((chucnang, index) => (
                    <Component key={index} chucnang={chucnang} />
                ))}
            </div>
            <PiMouseScroll size={25} className="text-white scroll-icon" />
        </div>
    );
}

export default SideBar;
