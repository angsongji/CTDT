import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Input, Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import { getAllCourses } from "../../services/courseServices";
import { getAllLecturers } from "../../services/lecturerServices";

const TeachingAssignment = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApi = async () => {
      const courses = await getAllCourses();
      const lecturers = await getAllLecturers();
	  const result = courses
	    .flatMap(course => {
	      const courseId = course.id;
	      const courseName = course.name;
	      const lecturerIds = course.lecturerCourses.map(lc => lc.id);
	      const matchedLecturers = lecturers.filter(lecturer =>
	        lecturer.lecturerCourses.some(lc => lecturerIds.includes(lc.id))
	      );

	      return course.groupOpeningPlans
	        .filter(plan => plan.status === 1)
	        .map(plan => {
	          const planGroups = plan.groups || [];

	          const groupAssignments = planGroups.map(group => ({
	            groupNumber: group.groupNumber,
	            assignmentIds: group.teachingAssignments.map(ta => ta.id)
	          }));

	          const groupLecturerPairs = [];

	          matchedLecturers.forEach(lecturer => {
	            const lecturerAssignmentIds = lecturer.teachingAssignments.map(ta => ta.id);

	            groupAssignments.forEach(group => {
	              const isAssigned = group.assignmentIds.some(id => lecturerAssignmentIds.includes(id));
	              if (isAssigned) {
	                groupLecturerPairs.push({
	                  GroupNumber: group.groupNumber,
	                  Id_Lecturer: lecturer.id,
	                  Name_Lecturer: lecturer.fullName
	                });
	              }
	            });
	          });

	          return {
	            key: `${courseId}_${plan.id}`,
	            Id_Course: courseId,
	            Name_Course: courseName,
	            groups: groupLecturerPairs
	          };
	        });
	    });

	  const finalData = result.filter(item => item.groups.length > 0).map((item, index) => ({
	    ...item,
	    stt: index + 1
	  }));

	  setDataSource(finalData);
    };

    fetchApi();
  }, []);

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
          {record.groups.map((group, idx) => (
            <div key={idx}>{group.GroupNumber}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Mã CBGD',
      key: 'groups',
      render: (text, record) => (
        <div>
          {record.groups.map((group, idx) => (
            <div key={idx}>{group.Id_Lecturer}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Họ và tên CBGD',
      key: 'groups',
      render: (text, record) => (
        <div>
          {record.groups.map((group, idx) => (
            <div key={idx}>{group.Name_Lecturer}</div>
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
            style={{ backgroundColor: '#007bff', marginRight: '10px' }}
            onClick={() => handleEdit(record.key)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
            onClick={() => handleEdit(record.key)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#F44336' }}
            onClick={() => handleEdit(record.key)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (key) => {
    console.log("Edit row with key:", key);
  };

  const filteredData = dataSource.filter(item =>
    item.Name_Course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Id_Course.toString().includes(searchTerm)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Phân công giảng dạy</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between mb-6">
          <Input
            placeholder="Tìm kiếm tên hoặc mã học phần..."
            style={{ width: '250px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/admin/teaching-assignment/assignment">
            <Button type="primary" className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]">
              <span className="text-white flex items-center gap-1"><FaPlus />Phân công giảng dạy</span>
            </Button>
          </Link>
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="Id_Course"
        />
      </div>
    </div>
  );
};

export default TeachingAssignment;
