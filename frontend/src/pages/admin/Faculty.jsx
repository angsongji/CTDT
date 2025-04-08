import { Table, Button, Input } from 'antd';
import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
const columns = [
    {
        title: 'Mã ngành',
        dataIndex: 'Id',
        key: 'Id',
    },
    {
        title: 'Tên ngành',
        dataIndex: 'Name',
        key: 'Name',
    },
    {
        title: 'Website',
        dataIndex: 'Website',
        key: 'Website',
    },
];

const list_faculty = [
    { Id: 1, Name: "Công nghệ thông tin", Website: "fit.sgu.edu.vn" },
    { Id: 2, Name: "Ngôn ngữ Anh", Website: "dfl.sgu.edu.vn" },
    { Id: 3, Name: "Tâm lí học", Website: "khoagiaoduc.sgu.edu.vn" },
    { Id: 1, Name: "Công nghệ thông tin", Website: "fit.sgu.edu.vn" },
    { Id: 2, Name: "Ngôn ngữ Anh", Website: "dfl.sgu.edu.vn" },
    { Id: 3, Name: "Tâm lí học", Website: "khoagiaoduc.sgu.edu.vn" },
    { Id: 2, Name: "Ngôn ngữ Anh", Website: "dfl.sgu.edu.vn" },
    { Id: 3, Name: "Tâm lí học", Website: "khoagiaoduc.sgu.edu.vn" },
];

const data = list_faculty;

function Faculty() {
    const [showFormAdd, setShowFormAdd] = useState(false);
    const TableData = () => (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            scrollToFirstRowOnChange={true}
        />
    )
    const FormAdd = () => {
        const [valueName, setValueName] = useState("")
        const [valueWebsite, setValueWebsite] = useState("")
        const handleSubmitForm = (e) => {
            e.preventDefault();
            alert('hi')
            console.log({
                name: valueName,
                website: valueWebsite
            });
            // gọi API hoặc xử lý dữ liệu ở đây
        };

        return (
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center">
                <form onSubmit={handleSubmitForm} className="relative text-sm w-[30vw] flex flex-col gap-10 bg-white p-5 rounded-md shadow-md flex items-center gap-5">
                    <div className='font-bold text-xl'>Thêm ngành</div>
                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Tên ngành</span>
                        <Input
                            type="text"
                            required
                            onChange={(e) => setValueName(e.target.value)}
                            value={valueName}
                            placeholder="Nhập tên..."
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                        />
                    </div>

                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Đường dẫn website</span>
                        <Input
                            type="url"
                            required
                            onChange={(e) => setValueWebsite(e.target.value)}
                            value={valueWebsite}
                            placeholder="Website..."
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                        />
                    </div>

                    <Button type='primary' htmlType="submit" className='!my-3 !bg-[var(--medium-pink2)] !text-white'>Thêm ngành</Button>
                    <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
                        <HiX size={28} className='text-white' />
                    </div>
                </form>


            </div>
        );
    };
    return (
        <div className='flex flex-col gap-5 mt-10'>
            {/* Hiện tìm kiếm vào các nút thao tác */}
            <div className='flex justify-end'>
                <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
                    <span onClick={() => setShowFormAdd(true)} className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
                        <FaPlus />Thêm ngành
                    </span>
                </Button>
            </div>
            <TableData />
            {showFormAdd && <FormAdd />}
        </div>

    );
}

export default Faculty;
