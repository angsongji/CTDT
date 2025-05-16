import React, { useState } from 'react';
import { Button } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { Dropdown, Table } from 'antd';
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { CiImport, CiExport } from "react-icons/ci";

const lecturers = [
  {
    "id": 1,
    "fullName": "Nguyễn Văn A",
    "dateOfBirth": "1970-05-12",
    "academicTitle": "Giáo sư",
    "degree": "Tiến sĩ",
    "gender": "Nữ",
    "status": 1,
    "lecturerCourses": [
      {
        "id": 12
      },
      {
        "id": 1
      },
      {
        "id": 13
      },
      {
        "id": 11
      }
    ],
  },

];
const Lecturer = () => {


  const columns = [
    {
      title: 'Mã giảng viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Học vị',
      dataIndex: 'degree',
      key: 'degree',
    },
    {
      title: 'Bằng cấp',
      dataIndex: 'academicTitle',
      key: 'academicTitle',
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              { key: "detail", label: "Xem học phần phụ trách giảng dạy" },
              { key: "edit", label: "Chỉnh sửa" },
              { key: "delete", label: "Xóa", danger: true },
            ],
            onClick: ({ key }) => handleMenuClick(key, record),
          }}
          trigger={["click"]}
        >
          <span className="cursor-pointer">
            <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
          </span>
        </Dropdown>
      ),
    },
  ];

  const handleMenuClick = (key, lecturer) => {
    switch (key) {
      case "detail":
        console.log("Xem thông tin chi tiết", lecturer);
        break;
      case "edit":
        console.log("Chỉnh sửa", lecturer);
        break;
      case "delete":
        console.log("Xóa", lecturer);
        break;
      default:
        break;
    }
  };

  const CustomButton = ({ icon, onClick, hoverText = "Click me" }) => {
    const [hovered, setHovered] = useState(false);
  
    return (
      <Button
        type="primary"
        shape="circle"
        onClick={onClick}
        className={`
          transition-all duration-300 flex items-center
          !bg-[var(--dark-pink)] 
          hover:!bg-[var(--medium-pink2)]   
          ${hovered ? '!rounded-md !px-2 ' : ''}
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {icon}
        {hovered && (
          <span className="ml-2 whitespace-nowrap text-sm font-medium">
            {hoverText}
          </span>
        )}
      </Button>
    );
  };
  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <Link className="text-sm text-white bg-[var(--medium-pink)] p-2 rounded-md" to="/admin/lecturer">Quản lý giảng viên</Link>
          <Link className="text-sm text-gray-400 p-2 rounded-md hover:bg-gray-200" to="/admin/lecturer/statistics">Thống kê</Link>
        </div>
        <div className='flex gap-2'>
        <CustomButton icon={<FaPlus />} onClick={() => console.log("Add")} hoverText="Thêm giảng viên"/>
        <CustomButton icon={<CiImport className="text-xl" />} onClick={() => console.log("Import")} hoverText="Import"/>
        <CustomButton icon={<CiExport className="text-xl" />} onClick={() => console.log("Export")} hoverText="Export"/>
      
        </div>
        </div>
      <Table
        columns={columns}
        dataSource={lecturers}
        pagination={{ pageSize: 5 }}
        scrollToFirstRowOnChange={true}
      />
    </div>
  );
};

export default Lecturer; 