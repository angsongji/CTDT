import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { getAllGroupOpenPlan } from "../../services/groupOpeningPlanServices";
import { getAllCourses } from "../../services/courseServices";

function Assignment() {

    const navigate = useNavigate();
	
	const [data, setData] = useState([]);
		
	const flattenCourses = (courses) => {
	  const result = [];
	  
	  const traverse = (nodes) => {
	    nodes.forEach(course => {
	      result.push(course);
	      if (course.children && course.children.length > 0) {
	        traverse(course.children);
	      }
	    });
	  };

	  traverse(courses);
	  return result;
	};

	useEffect(() => {
	  const fetchAPI = async () => {
	    const groupPlan = await getAllGroupOpenPlan();
	    const courses = await getAllCourses();

	    const flatCourses = flattenCourses(courses);

	    const dataNew = groupPlan
	      .filter(item =>
	        item.status === 1 &&
	        item.groups.some(group => group.teachingAssignments.length === 0)
	      )
	      .map((item, index) => {
	        // Tìm học phần chứa group này
	        const matchedCourse = flatCourses.find(course =>
	          course.groupOpeningPlans?.some(plan =>
	            plan.groups?.some(group => item.groups.some(g => g.id === group.id))
	          )
	        );

	        return {
	          ...item,
	          key: index + 1,
	          courseId: matchedCourse?.id || null,
	          nameCourse: matchedCourse?.name || "Không xác định"
	        };
	      });

	    setData(dataNew);
	  };

	  fetchAPI();
	}, []);
		
	console.log("dataNew",data);

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
            title: 'Thao tác',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#007bff', borderColor: '#007bff', marginRight: '10px' }}
                        onClick={() => handleEdit(record)}
                    >
                        Phân công
                    </Button>
                </>
            ),
        },
    ];

    const handleEdit = (record) => {
        navigate(`/admin/teaching-assignment/assignment/create`, { state: { record } });
    };

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Phân công giảng dạy</h1>
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
                        dataSource={data}
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