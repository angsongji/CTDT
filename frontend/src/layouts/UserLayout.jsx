import { Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';

const UserLayout = () => (
    <div className='w-full min-h-screen bg-[#FFF5F5]'>
        <Header />
        <div className='w-full min-h-screen'>
            <Outlet />
        </div>
        <Footer />
    </div>
);
export default UserLayout;
