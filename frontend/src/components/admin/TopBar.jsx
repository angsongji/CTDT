import { useState } from "react";
import { RxExit } from "react-icons/rx";
import "../../index.css";
import { useNavigate } from "react-router-dom";
function TopBar() {
    const [user, setUser] = useState("Mèo méo meo");
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    }
    return (
        <div className="border-b-1 border-[var(--dark-pink)] p-5 py-3 flex justify-between">
            <div>
                <div className="text-[var(--medium-pink2)] text-2xl">Xin chào!</div>
                <div className="text-[var(--dark-pink)] font-bold">{user}</div>
            </div>
            <div className="self-center cursor-pointer" onClick={() => handleLogout()}>
                <RxExit className="text-[var(--dark-pink)] text-2xl" />
            </div>
        </div>
    )
}
export default TopBar;
