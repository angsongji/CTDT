import React, {  useState } from 'react';
import { Input, Button, Table, Select } from 'antd';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

const CreateTeachingAssignment = () => {
	
	
	
    const rawDataSource = [
        {
            key: '1',
            startYear: '2021',
            Id_Course: '841302', // Mã HP
            Name_Course: 'Cơ sở lập trình',
            GroupNumber: '1',
        },
        {
            key: '2',
            startYear: '2021',
            Id_Course: '841302',
            Name_Course: 'Cơ sở lập trình',
            GroupNumber: '2',
        },
    ];

    // Dữ liệu giảng viên tách ra ngoài rawDataSource
    const lecturers = [
        { Id_Lecturer: '10409', Name_Lecturer: 'Phạm Hoàng Vương' },
        { Id_Lecturer: '10615', Name_Lecturer: 'Trần Nguyễn Minh Hiếu' },
        { Id_Lecturer: '10063', Name_Lecturer: 'Lai Đình Khải' },
    ];

    // Tạo một dictionary giảng viên để tra cứu tên từ mã giảng viên
    const lecturerMap = lecturers.reduce((acc, lecturer) => {
        acc[lecturer.Id_Lecturer] = lecturer.Name_Lecturer;
        return acc;
    }, {});

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
        });
        return acc;
    }, {});

    const dataSource = Object.values(groupedData).map((item, index) => ({
        ...item,
        stt: index + 1,
    }));

    const [selectedLecturer, setSelectedLecturer] = useState({});
    const [selectedLecturerName, setSelectedLecturerName] = useState({});

    // Hàm xử lý thay đổi giảng viên cho mỗi nhóm
    const handleLecturerChange = (groupKey, value, isIdLecturer) => {
        if (isIdLecturer) {
            // Nếu chọn mã CBGD
            setSelectedLecturer((prev) => ({
                ...prev,
                [groupKey]: value,
            }));
            // Cập nhật tên giảng viên
            const name = lecturerMap[value];
            setSelectedLecturerName((prev) => ({
                ...prev,
                [groupKey]: name,
            }));
        } else {
            // Nếu chọn tên giảng viên
            setSelectedLecturerName((prev) => ({
                ...prev,
                [groupKey]: value,
            }));
            // Cập nhật mã giảng viên
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
                        <Select
                            key={`${group.GroupNumber}-lecturer`}
                            style={{ width: '100%' }}
                            placeholder="Chọn mã CBGD"
                            value={selectedLecturer[group.GroupNumber]} // Hiển thị mã CBGD đã chọn
                            onChange={(value) => handleLecturerChange(group.GroupNumber, value, true)}
                        >
                            {lecturers.map((lecturer) => (
                                <Select.Option key={lecturer.Id_Lecturer} value={lecturer.Id_Lecturer}>
                                    {lecturer.Id_Lecturer}
                                </Select.Option>
                            ))}
                        </Select>
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
                        <Select
                            key={`${group.GroupNumber}-lecturer-name`}
                            style={{ width: '100%' }}
                            placeholder="Chọn tên CBGD"
                            value={selectedLecturerName[group.GroupNumber]} // Hiển thị tên giảng viên đã chọn
                            onChange={(value) => handleLecturerChange(group.GroupNumber, value, false)}
                        >
                            {lecturers.map((lecturer) => (
                                <Select.Option key={lecturer.Name_Lecturer} value={lecturer.Name_Lecturer}>
                                    {lecturer.Name_Lecturer}
                                </Select.Option>
                            ))}
                        </Select>
                    ))}
                </div>
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
                    rowKey="Id_Course"
                    pagination={false}  
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
                                            <td>{selectedLecturer[group.GroupNumber] || 'Chưa chọn'}</td>
                                            <td>{selectedLecturerName[group.GroupNumber] || 'Chưa chọn'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ),
                        rowExpandable: (record) => record.groups.length > 1,
                    }}
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
