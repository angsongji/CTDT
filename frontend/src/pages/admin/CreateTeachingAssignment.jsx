import React, { useState } from 'react';
import { Input, Button, Table, Select } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

const  CreateTeachingAssignment = () => {
    const location = useLocation();
    const record = location.state?.record;
    console.log("record", record);

    const lecturers = [
        { Id_Lecturer: '10409', Name_Lecturer: 'Phạm Hoàng Vương' },
        { Id_Lecturer: '10615', Name_Lecturer: 'Trần Nguyễn Minh Hiếu' },
        { Id_Lecturer: '10063', Name_Lecturer: 'Lai Đình Khải' },
    ];

    const lecturerMap = lecturers.reduce((acc, lecturer) => {
        acc[lecturer.Id_Lecturer] = lecturer.Name_Lecturer;
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
            const id = lecturers.find((lecturer) => lecturer.Name_Lecturer === value)?.Id_Lecturer;
            setSelectedLecturer((prev) => ({
                ...prev,
                [groupKey]: id,
            }));
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
                        <Select.Option key={lecturer.Id_Lecturer} value={lecturer.Id_Lecturer}>
                            {lecturer.Id_Lecturer}
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
                        <Select.Option key={lecturer.Name_Lecturer} value={lecturer.Name_Lecturer}>
                            {lecturer.Name_Lecturer}
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
                    <Button type="primary" className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]">
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateTeachingAssignment;
