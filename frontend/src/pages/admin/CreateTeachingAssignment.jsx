import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Select, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { getAllLecturers } from "../../services/lecturerServices";
import { createTeachingAssignment } from "../../services/teachingAssignmentCycleServices";


const  CreateTeachingAssignment = () => {
    const location = useLocation();
    const record = location.state?.record;
	const [lecturers, setLecturers] = useState([]);
	const navigate = useNavigate();

	
	useEffect(() => {
		const fetchApi = async () => {
			const lecturerCourses = (record.course.lecturerCourses || []);
			const lecturerIds = lecturerCourses.map(lc => lc.id); // Lấy ra id của lecturerCourses
			// Gọi API để lấy danh sách giảng viên
			const listLecturers = await getAllLecturers();

			// Lọc ra những giảng viên có lecturerCourses trùng với lecturerIds
			const formattedResults = listLecturers.filter(lecturer => {
				// kiểm tra nếu lecturerCourses của từng lecturer có id trùng với lecturerIds
				const lecturerCourseIds = (lecturer.lecturerCourses || []).map(lc => lc.id);
				return lecturerCourseIds.some(id => lecturerIds.includes(id));
			});

			setLecturers(formattedResults);
		};

		fetchApi();
	}, []);
	


    const lecturerMap = lecturers.reduce((acc, lecturer) => {
        acc[lecturer.id] = lecturer.fullName;
        return acc;
    }, {});

    const dataSource = record.groups.map((group) => ({
        key: `${record.course.id}-${group.groupNumber}`,
        Id_Course: record.course.id,
        Name_Course: record.nameCourse || record.course.name,
        GroupNumber: group.groupNumber,
    }));

    const [selectedLecturer, setSelectedLecturer] = useState({});
    const [selectedLecturerName, setSelectedLecturerName] = useState({});

    const handleLecturerChange = (groupKey, value, isIdLecturer) => {
        if (isIdLecturer) {
            setSelectedLecturer((prev) => ({
                ...prev,
                [groupKey]: value,
            }));
            const name = lecturerMap[value];
            setSelectedLecturerName((prev) => ({
                ...prev,
                [groupKey]: name,
            }));
        } else {
            setSelectedLecturerName((prev) => ({
                ...prev,
                [groupKey]: value,
            }));
            const id = lecturers.find((lecturer) => lecturer.fullName === value)?.id;
            setSelectedLecturer((prev) => ({
                ...prev,
                [groupKey]: id,
            }));
        }
    };
	
	const handleSubmit = async () => {
	    const unassignedGroups = record.groups.filter(group => !selectedLecturer[group.groupNumber]);

	    if (unassignedGroups.length > 0) {
	        message.warning("Vui lòng chọn giảng viên cho tất cả các nhóm trước khi xác nhận.");
	        return;
	    }

	    const requests = record.groups.map((group) =>
	        createTeachingAssignment({
	            status: 1,
	            group: { id: group.id },
	            lecturer: { id: selectedLecturer[group.groupNumber] }
	        })
	    );

	    try {
	        await Promise.all(requests);
	        message.success("Tạo phân công giảng dạy thành công!");
			navigate(-1);
	    } catch (error) {
	        console.error("Lỗi khi gửi dữ liệu:", error);
	        message.error("Đã xảy ra lỗi khi tạo phân công giảng dạy.");
	    }
	};


    const columns = [
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
            dataIndex: 'GroupNumber',
            key: 'GroupNumber',
			sorter: (a, b) => a.GroupNumber - b.GroupNumber, 
        },
        {
            title: 'Mã CBGD',
            key: 'lecturerIds',
            render: (text, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn mã CBGD"
                    value={selectedLecturer[record.GroupNumber]}
                    onChange={(value) => handleLecturerChange(record.GroupNumber, value, true)}
                >
                    {lecturers.map((lecturer) => (
                        <Select.Option key={lecturer.id} value={lecturer.id}>
                            {lecturer.id}
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Họ và tên CBGD',
            key: 'lecturerNames',
            render: (text, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn tên CBGD"
                    value={selectedLecturerName[record.GroupNumber]}
                    onChange={(value) => handleLecturerChange(record.GroupNumber, value, false)}
                >
                    {lecturers.map((lecturer) => (
                        <Select.Option key={lecturer.fullName} value={lecturer.fullName}>
                            {lecturer.fullName}
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Phân công giảng dạy</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className='flex justify-end mb-10'>
                    <Link to="/admin/teaching-assignment/assignment">
                        <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
                            <span className=' text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
                                <IoArrowBack /> Trở lại
                            </span>
                        </Button>
                    </Link>
                </div>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={false}
                />

                <div className="mt-6 flex justify-end">
                    <Button type="primary" className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateTeachingAssignment;
