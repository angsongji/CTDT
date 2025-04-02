import { Table, Button } from 'antd';
import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
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
    const TableData = () => (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            scrollToFirstRowOnChange={true}
        />
    )
    return (
        <div className='flex flex-col gap-5 mt-10'>
            {/* Hiện tìm kiếm vào các nút thao tác */}
            <div className='flex justify-end'>
                <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
                    <span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
                        <FaPlus />Thêm ngành
                    </span>
                </Button>
            </div>
            <TableData />
        </div>

    );
}

export default Faculty;
