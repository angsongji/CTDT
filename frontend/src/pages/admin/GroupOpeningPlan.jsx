import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";

function GroupOpeningPlan(){
  const [data, setData] = useState([]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Tên Học Phần',
      dataIndex: 'nameCouse',
      key: 'nameCouse',
    },
    {
      title: 'Số Nhóm',
      dataIndex: 'numberOfGroups',
      key: 'numberOfGroups',
    },
    {
      title: 'Số Sinh Viên',
      dataIndex: 'numberOfStudents',
      key: 'numberOfStudents',
    },
    {
      title: 'Trạng Thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => {
        let color = status == 1 ? 'geekblue' : 'green';
        if (status === 0) {
          color = 'volcano';
        }
        return <Tag color={color}>{status == 1 ? 'Hoạt động' : 'Đã kết thúc'}</Tag>;
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
  
  useEffect(() => {
        const fetchAPI = async () => {
          const res = await fetch(`http://localhost:8081/api/group-open-plan`);
          const result = await res.json();
          const dataNew = result.map((item, index) => ({
            ...item,
            key: index + 1,
			nameCouse: item.course.name,
          }));
         setData(dataNew);
        }
        fetchAPI();
  },[])
  console.log(data);

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
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 3 }}
          scrollToFirstRowOnChange={true}
        />
      </div>
    </div>
  );
};

export default GroupOpeningPlan;
