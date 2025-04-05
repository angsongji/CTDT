import React from 'react';
import { FaPlus } from "react-icons/fa6";
import { Input, Button, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const TeachingAssignment = () => {
  const rawDataSource = [
    {
      key: '1',
      stt: '1',
      startYear: '2021',
      Id_Course: '841302', // Thêm Mã HP
      Name_Course: 'Cơ sở lập trình',
      GroupNumber: '1',
      Id_Lecturer: '10409',
      Name_Lecturer: 'Phạm Hoàng Vương',
    },
    {
      key: '2',
      stt: '2',
      startYear: '2021',
      Id_Course: '841302',
      Name_Course: 'Cơ sở lập trình',
      GroupNumber: '1',
      Id_Lecturer: '10615',
      Name_Lecturer: 'Trần Nguyễn Minh Hiếu',
    },
    {
      key: '3',
      stt: '3',
      startYear: '2021',
      Id_Course: '841302',
      Name_Course: 'Cơ sở lập trình',
      GroupNumber: '2',
      Id_Lecturer: '10063',
      Name_Lecturer: 'Lai Đình Khải',
    },
    {
      key: '4',
      stt: '4',
      startYear: '2021',
      Id_Course: '841021',
      Name_Course: 'Kiến trúc máy tỉnh',
      GroupNumber: '1',
      Id_Lecturer: '11544',
      Name_Lecturer: 'Hà Thanh Dũng',
    },
    {
      key: '5',
      stt: '5',
      startYear: '2021',
      Id_Course: '841021',
      Name_Course: 'Kiến trúc máy tỉnh',
      GroupNumber: '2',
      Id_Lecturer: '11377',
      Name_Lecturer: 'Nguyễn Trung Tín',
    },
    {
      key: '6',
      stt: '6',
      startYear: '2021',
      Id_Course: '841021',
      Name_Course: 'Kiến trúc máy tỉnh',
      GroupNumber: '4',
      Id_Lecturer: '10015',
      Name_Lecturer: 'Huỳnh Tổ Hạp',
    },
    {
      key: '7',
      stt: '7',
      startYear: '2021',
      Id_Course: '841403',
      Name_Course: 'Cấu trúc rời rạc',
      GroupNumber: '3',
      Id_Lecturer: '10218',
      Name_Lecturer: 'Huỳnh Minh Tri',
    },
    {
      key: '8',
      stt: '8',
      startYear: '2021',
      Id_Course: '841403',
      Name_Course: 'Cấu trúc rời rạc',
      GroupNumber: '1',
      Id_Lecturer: '11381',
      Name_Lecturer: 'Phạm Thế Bảo',
    },
    {
      key: '9',
      stt: '9',
      startYear: '2021',
      Id_Course: '841403',
      Name_Course: 'Cấu trúc rời rạc',
      GroupNumber: '2',
      Id_Lecturer: '10943',
      Name_Lecturer: 'Nguyễn Hòa',
    },
  ];

  // Xử lý dữ liệu để gom nhóm
  const groupedData = rawDataSource.reduce((acc, current) => {
    const key = current.Id_Course;
    if (!acc[key]) {
      acc[key] = {
        key: key,
        stt: current.stt,
        Id_Course: current.Id_Course,
        Name_Course: current.Name_Course,
        groups: [],
      };
    }
    acc[key].groups.push({
      GroupNumber: current.GroupNumber,
      Id_Lecturer: current.Id_Lecturer,
      Name_Lecturer: current.Name_Lecturer,
    });
    return acc;
  }, {});

  const dataSource = Object.values(groupedData).map((item, index) => ({
    ...item,
    stt: index + 1, 
  }));

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Mã HP',
      dataIndex: 'Id_Course',
      key: 'Id_Course',
    },
    {
      title: 'Tên học phần',
      dataIndex: 'Name_Course',
      key: 'Name_Course',
    },
    {
      title: 'Nhóm',
      key: 'groups',
      render: (text, record) => (
        <div>
          {record.groups.map((group) => (
            <div key={`${record.key}-${group.GroupNumber}`}>
              {group.GroupNumber}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Mã CBGD',
      key: 'groups',
      render: (text, record) => (
        <div>
          {record.groups.map((group) => (
            <div key={`${record.key}-${group.Id_Lecturer}`}>
              {group.Id_Lecturer}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Họ và tên CBGD',
      key: 'groups',
      render: (text, record) => (
        <div>
          {record.groups.map((group) => (
            <div key={`${record.key}-${group.Name_Lecturer}`}>
              {group.Name_Lecturer}
            </div>
          ))}
        </div>
      ),
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
    console.log('Edit:', key);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Phân công giảng dạy</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className='flex justify-between mb-10'>
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px', padding: '0.25rem 0.5rem' }} />

          <Link to="/admin/teaching-assignment">
            <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
              <span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
                <FaPlus />Phân công giảng dạy
              </span>
            </Button>
          </Link>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 2 }}
          rowKey="Id_Course" 
          expandable={{
            expandIcon: () => null, 
            expandedRowRender: (record) => (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Nhóm</th>
                    <th>Mã CBGD</th>
                    <th>Họ và tên CBGD</th>
                  </tr>
                </thead>
                <tbody>
                  {record.groups.map((group) => (
                    <tr key={`${record.Id_Course}-${group.GroupNumber}`}>
                      <td>{group.GroupNumber}</td>
                      <td>{group.Id_Lecturer}</td>
                      <td>{group.Name_Lecturer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ),
            rowExpandable: (record) => record.groups.length > 1, 
          }}
        />
      </div>
    </div>
  );
};

export default TeachingAssignment;