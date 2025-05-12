import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { removeVietnameseTones } from "../../helpers/regex";
import { getAllGroupOpenPlan, editGroupOpenPlan } from "../../services/groupOpeningPlanCycleServices";
import { getAllCourses } from "../../services/courseCycleServices";
import Swal from 'sweetalert2';


function GroupOpeningPlan() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 
  const [reset, setReset] = useState(false);

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
            onClick={() => handleDel(record.id)}
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
		const filteredPlans = groupPlans.filter(plan => plan.status !== 3);

        // Gán nameCourse vào mỗi groupOpeningPlan
        const dataNew = filteredPlans.map((item, index) => ({
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
  }, [reset]);
  
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
	
	const handleDel = async (id) => {
	  const result = await Swal.fire({
	    title: 'Bạn có chắc chắn muốn xóa?',
	    text: "Hành động này không thể hoàn tác!",
	    icon: 'warning',
	    showCancelButton: true,
	    confirmButtonColor: '#d33',
	    cancelButtonColor: '#3085d6',
	    confirmButtonText: 'Xóa',
	    cancelButtonText: 'Hủy'
	  });

	  if (result.isConfirmed) {
	    try {
	      // Tìm dữ liệu gốc theo id
	      const planToDelete = data.find(item => item.id === id);
	      if (!planToDelete) return;

	      // Gửi toàn bộ dữ liệu kèm status mới
	      const updatedData = { ...planToDelete, status: 3 };

	      const response = await editGroupOpenPlan(id, updatedData);
	      if (response) {
	        Swal.fire('Đã xóa!', 'Kế hoạch mở lớp đã được xóa thành công.', 'success');

	        setReset(!reset);
	      }
	    } catch (error) {
		  console.log("error", error);
	      Swal.fire({
	        title: 'Lỗi!',
	        text: 'Không thể xóa kế hoạch mở lớp.',
	        icon: 'error'
	      });
	    }
	  }
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
