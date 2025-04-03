import React from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";

function GroupOpeningPlan(){

  const dataSource = [
    {
      key: '1',
      stt: 1,
      Name: 'Lập trình C',
      NumberOfGroups: 3,
      NumberOfStudents: 90,
      Status: 'Đang hoạt động',
    },
    {
      key: '2',
      stt: 2,
      Name: 'Cơ sở dữ liệu',
      NumberOfGroups: 2,
      NumberOfStudents: 60,
      Status: 'Đang hoạt động',
    },
    {
      key: '3',
      stt: 3,
      Name: 'Kinh tế vĩ mô',
      NumberOfGroups: 4,
      NumberOfStudents: 120,
      Status: 'Đang hoạt động',
    },
    {
      key: '4',
      stt: 4,
      Name: 'Quản trị doanh nghiệp',
      NumberOfGroups: 2,
      NumberOfStudents: 60,
      Status: 'Đã kết thúc',
    },
    {
      key: '5',
      stt: 5,
      Name: 'Mạng máy tính',
      NumberOfGroups: 3,
      NumberOfStudents: 90,
      Status: 'Đang hoạt động',
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
      title: 'Trạng Thái',
      key: 'Status',
      dataIndex: 'Status',
      render: (_, { Status }) => {
        let color = Status === 'Đang hoạt động' ? 'geekblue' : 'green';
        if (Status === 'Đã kết thúc') {
          color = 'volcano';
        }
        return <Tag color={color}>{Status.toUpperCase()}</Tag>;
      },
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
            Chi tiết
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', marginRight: '10px' }}
            onClick={() => handleEdit(record.key)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#F44336', borderColor: '#F44336' }}
            onClick={() => handleEdit(record.key)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (key) => {
    console.log('Edit record with key:', key);
    // Thêm logic xử lý khi nhấn vào các nút Chi tiết, Sửa, Xóa
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kế hoạch mở lớp</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className='flex justify-between mb-10'>
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px', padding: '0.25rem 0.5rem' }} />
          <Link to="/admin/group-opening-plan/create">
            <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
              <span className='text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
                <FaPlus />Thêm
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
  );
};

export default GroupOpeningPlan;
