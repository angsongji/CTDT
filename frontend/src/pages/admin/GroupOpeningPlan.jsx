import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { removeVietnameseTones } from "../../helpers/regex";
import { getAllGroupOpenPlan } from "../../services/groupOpeningPlanCycleServices";
import { getAllCourses } from "../../services/courseCycleServices";

function GroupOpeningPlan() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Tên Học Phần',
      dataIndex: 'nameCourse',
      key: 'nameCourse',
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
        let color = status === 1 ? 'geekblue' : 'volcano';
        return <Tag color={color}>{status === 1 ? 'Hoạt động' : 'Đã kết thúc'}</Tag>;
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
            onClick={() => handleDetail(record.id)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', marginRight: '10px' }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#F44336', borderColor: '#F44336' }}
            onClick={() => handleEdit(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchAPI = async () => {
      try {
		const groupPlans = await getAllGroupOpenPlan();
		const courses = await getAllCourses();
		
        // Tạo map courseId -> courseName
        const courseMap = {};
        courses.forEach(course => {
          course.groupOpeningPlans.forEach(plan => {
            courseMap[plan.id] = course;
          });
        });

        // Gán nameCourse vào mỗi groupOpeningPlan
        const dataNew = groupPlans.map((item, index) => ({
          ...item,
          key: index + 1,
		  nameCourse: courseMap[item.id]?.name || "Không có học phần", 
          course: courseMap[item.id] || null, 
        }));

        setData(dataNew);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAPI();
  }, []);
  
  //console.log(data);

  const filteredData = searchTerm
    ? data.filter((item) =>
        removeVietnameseTones(item.nameCourse || "").includes(
          removeVietnameseTones(searchTerm)
        )
      )
    : data;

  const handleEdit = (record) => {
	navigate(`/admin/group-opening-plan/edit/${record.id}`, { state: { groupData: record } });
  };
  
  const handleDetail = (key) => {
	  navigate(`/admin/group-opening-plan/detail/${key}`);
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kế hoạch mở lớp</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between mb-10">
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px', padding: '0.25rem 0.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/admin/group-opening-plan/create">
            <Button type="primary" className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]">
              <span className="text-white px-2 py-1 rounded-md flex items-center justify-center gap-1">
                <FaPlus /> Thêm
              </span>
            </Button>
          </Link>
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 3 }}
          scrollToFirstRowOnChange={true}
        />
      </div>
    </div>
  );
}

export default GroupOpeningPlan;
