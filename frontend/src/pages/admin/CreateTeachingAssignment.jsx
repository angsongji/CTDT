import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Select, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { createTeachingAssignment } from "../../services/teachingAssignmentServices";
import { getLecturerCoursesByCourseId } from "../../services/lecturerCourseServices";

const CreateTeachingAssignment = () => {
    const location = useLocation();
    const record = location.state?.record;
    const [lecturers, setLecturers] = useState([]);
    const navigate = useNavigate();

    const [selectedLecturers, setSelectedLecturers] = useState({});

    useEffect(() => {
        if (!record) return;

        const fetchApi = async () => {
            const lecturersData = await getLecturerCoursesByCourseId(record.courseId);
            setLecturers(lecturersData);
        };

        fetchApi();
    }, [record]);

    const dataSource = record?.groups.map((group) => ({
        key: `${record.courseId}-${group.groupNumber}`,
        Id_Course: record.courseId,
        Name_Course: record.nameCourse,
        GroupNumber: group.id,
    })) || [];

    const handleLecturerChange = (groupId, value) => {
        setSelectedLecturers((prev) => ({
            ...prev,
            [groupId]: value,
        }));
    };

    const handleSubmit = async () => {
        const unassignedGroups = record.groups.filter(group => !selectedLecturers[group.id] || selectedLecturers[group.id].length === 0);

        if (unassignedGroups.length > 0) {
            message.warning("Vui lòng chọn giảng viên cho tất cả các nhóm trước khi xác nhận.");
            return;
        }

        const requests = [];
        record.groups.forEach((group) => {
            const lecturerIds = selectedLecturers[group.id];
            lecturerIds.forEach((lecturerId) => {
                requests.push(
                    createTeachingAssignment({
                        status: 1,
                        group: { id: group.id },
                        lecturer: { id: lecturerId }
                    })
                );
            });
        });

        try {
            await Promise.all(requests);
			console.log("requests",requests);
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
        },
        {
            title: 'Chọn giảng viên (ID)',
            key: 'lecturerIds',
            render: (text, record) => (
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Chọn mã CBGD"
                    value={selectedLecturers[record.GroupNumber] || []}
                    onChange={(value) => handleLecturerChange(record.GroupNumber, value)}
                >
                    {lecturers.map((lecturer) => (
                        <Select.Option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                            {lecturer.lecturerId} - {lecturer.lecturerName}
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
