import { useState, useEffect } from "react";
import "../../index.css";

function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="sticky top-0 z-2 bg-[var(--light-pink)] border-b-1 border-[var(--dark-pink)] p-5 py-3 flex justify-between items-center shadow-md">
            <div className="text-[var(--medium-pink2)] text-xl"><b>Chào bạn! </b>Admin</div>
            <div className="text-[var(--dark-pink)] text-sm ">
                <div>{formatDate(currentTime)}</div>
                <div className="text-right font-bold text-base">{formatTime(currentTime)}</div>
            </div>
        </div>
    )
}

export default TopBar;
