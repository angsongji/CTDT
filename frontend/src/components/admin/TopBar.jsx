import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import "../../index.css";

function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [openNotification, setOpenNotification] = useState(false);
    const [currentMessage, setCurrentMessage] = useState("");
    const audio = new Audio("notification.mp3");
    audio.load();

    const notifications = [
        "Lo mà làm bài, có người đang giám sát đây!",
        "Code nãy giờ rồi có làm được con mèo gì chưa vậy! Push lên check nào",
        "Đi ăn vặt uống nước gì đi rồi code tiếp",
        "Tôi mà giàu là giờ không ở đây làm cái củ nợ này!",
        "Chăm chỉ quá tời mà không biết nãy giờ code được con mèo gì chưa nữa",
        "Rầu ghê, cần được chữa lành bằng một ly trà sữa",
        "Nếu bạn thấy thông báo này, một là chưa code xong hai là đang fix lỗi",
        "Ai còn code chứ tôi, tôi đi ngủ cho nhẹ người",
        "Tùm lum tùm lum thiệc chứ",
        "Mệt quá tời, nguyện hiến tế 2 đồng đội của tôi để đổi lấy 1 ly trà sữa",
        "Có vấn đề gì cứ nhắn, tôi có thể không giải quyết được nhưng tôi có thể làm nó tùm lum tùm lum hơn"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const showRandomNotification = () => {
            const randomMessage = notifications[Math.floor(Math.random() * notifications.length)];
            setCurrentMessage(randomMessage);
            setOpenNotification(true);
            audio.play();
        };

        // Random interval between 2-5 minutes (120000-300000 ms)
        const randomInterval = Math.floor(Math.random() * (300000 - 120000 + 1) + 120000);
        const notificationTimer = setInterval(showRandomNotification, randomInterval);

        return () => clearInterval(notificationTimer);
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
        <>
            <div className="sticky top-0 z-2 bg-[var(--light-pink)] border-b-1 border-[var(--dark-pink)] p-5 py-3 flex justify-between items-center shadow-md">
                <div className="text-[var(--medium-pink2)] text-xl"><b>Chào bạn! </b>Admin</div>
                <div className="text-[var(--dark-pink)] text-sm ">
                    <div>{formatDate(currentTime)}</div>
                    <div className="text-right font-bold text-base">{formatTime(currentTime)}</div>
                </div>
            </div>
            <Snackbar
                open={openNotification}
                autoHideDuration={10000}
                onClose={() => setOpenNotification(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenNotification(false)}
                    severity="info"
                    sx={{ width: '100%' }}
                >
                    {currentMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default TopBar;
