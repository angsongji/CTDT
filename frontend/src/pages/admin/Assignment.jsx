import React from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";


function Assignment() {

    const navigate = useNavigate();

    const dataSource = [
        {
            key: '1',
            stt: 1,
            Name: 'Lập trình C',
            NumberOfGroups: 3,
            NumberOfStudents: 90,
        },
        {
            key: '2',
            stt: 2,
            Name: 'Cơ sở dữ liệu',
            NumberOfGroups: 2,
            NumberOfStudents: 60,
        },
        {
            key: '3',
            stt: 3,
            Name: 'Kinh tế vĩ mô',
            NumberOfGroups: 4,
            NumberOfStudents: 120,
        },
        {
            key: '4',
            stt: 4,
            Name: 'Quản trị doanh nghiệp',
            NumberOfGroups: 2,
            NumberOfStudents: 60,
        },
        {
            key: '5',
            stt: 5,
            Name: 'Mạng máy tính',
            NumberOfGroups: 3,
            NumberOfStudents: 90,
        },
    ];

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Tên Học Phần',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Số Nhóm',
            dataIndex: 'NumberOfGroups',
            key: 'NumberOfGroups',
        },
        {
            title: 'Số Sinh Viên',
            dataIndex: 'NumberOfStudents',
            key: 'NumberOfStudents',
        },
        {
            title: 'Thao tác',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#007bff', borderColor: '#007bff', marginRight: '10px' }}
                        onClick={() => handleEdit(record.key)}
                    >
                        Phân công
                    </Button>
                </>
            ),
        },
    ];

    const handleEdit = (key) => {
        navigate(`/admin/teaching-assignment/assignment/create`);
    };

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Phân công dạy học</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className='flex justify-between mb-10'>
                        <Input
                            placeholder="Tìm kiếm..."
                            style={{ width: '250px', padding: '0.25rem 0.5rem' }} />
                        <Link to="/admin/teaching-assignment">
                            <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
                                <span className='text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
                                    <IoArrowBack /> Trở lại
                                </span>
                            </Button>
                        </Link>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{ pageSize: 3 }}
                        scrollToFirstRowOnChange={true}
                    />
                </div>
            </div>
        </>
    )
}

export default Assignment;