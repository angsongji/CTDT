import "../../index.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
const list_chucnang = [
    {
        key: 0,
        name: "Trang chủ",
        path: "/",
    },
    {
        key: 1,
        name: "Chương trình đào tạo ",
        path: "/curriculum",
    }
]
function Footer() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]); // Mỗi khi đường dẫn thay đổi, tự động cuộn lên

    return (
        <div className="flex items-center h-[50vh] text-sm border-t-1 border-[var(--dark-pink)]">
            <div id="footer" className="h-fit w-full flex justify-around text-[var(--dark-pink)]">
                <img src="/logoSGU.png" className="w-[20vw] h-fit" />
                <div className="flex flex-col gap-6 ">
                    {
                        list_chucnang.map((chucnang) => (
                            <Link className="!text-[var(--dark-pink)]" to={chucnang.path}>{chucnang.name}</Link>
                        ))
                    }
                    
                </div>
                <div className="flex flex-col gap-6">
                    <div>Địa chỉ: 273 An Dưong Vưong, Quận 5, TP.HCM</div>
                    <div>Email: email232@gmail.com</div>
                    <div>Số điện thoại: 0909887665</div>
                    <div>Thời gian hoạt động: 9:00 - 16:00</div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
