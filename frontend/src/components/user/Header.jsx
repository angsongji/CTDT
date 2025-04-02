import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../index.css";

const list_chucnang = [
    { key: 0, name: "Trang chủ", path: "/" },
    { key: 1, name: "Chương trình đào tạo", path: "/curriculum" },
    { key: 2, name: "Liên hệ", path: "footer" }
];

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(() => {
        if (location.pathname === "/") return 0;
        if (location.pathname === "/curriculum") return 1;
        return null;
    });

    // Cập nhật trạng thái selected khi đường dẫn thay đổi
    useEffect(() => {
        if (location.pathname === "/") setSelected(0);
        if (location.pathname === "/curriculum") setSelected(1);
    }, [location.pathname]);

    const handleNavigation = (chucnang) => {
        
        if (chucnang.path === "footer") {
            document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(chucnang.path);
            setSelected(chucnang.key);
        }
    };

    return (
        <div className="flex justify-between items-center bg-[#FFDEDE] h-fit px-5">
            <img src="/logoSGU.png" alt="logo" className="w-[10%] object-cover h-auto" onClick={() => navigate("/")}/>
            <div className="flex gap-10">
                {list_chucnang.map((chucnang) => (
                    <div key={chucnang.key} 
                        className={`cursor-pointer flex items-center py-5 ${selected === chucnang.key ? "!border-b-2 !border-[var(--dark-pink)]" : ""}`}
                    >
                        <Link to={chucnang.path}  
                            className={`!text-sm !font-bold ${selected === chucnang.key ? "!text-[var(--dark-pink)]" : "!text-[#E1ACAC] hover:!text-[var(--dark-pink)]"}`}
                            onClick={(e) => {
                                e.preventDefault(); 
                                handleNavigation(chucnang);
                            }}
                        >
                            {chucnang.name}
                        </Link>
                    </div>
                ))}
            </div>
            <button 
            onClick={() => navigate("/sign-in")}
            className="cursor-pointer text-sm rounded-full px-3 py-1 border-1 border-[var(--dark-pink)] text-[var(--dark-pink)]">
                ĐĂNG NHẬP
            </button>
        </div>
    );
};

export default Header;
