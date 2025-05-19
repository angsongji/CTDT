import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Select, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getLecturerCoursesByCourseId } from "../../services/lecturerCourseServices";
import { createTeachingAssignment, delTeachingAssignment } from "../../services/teachingAssignmentServices";

const EditTeachingAssignment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state.record;
  const selectedCycle = location.state.selectedCycle;
  const selectedFaculty = location.state.selectedFaculty;
  
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState({});

  const allGroups = record?.groups?.flatMap(groupWrapper => groupWrapper.groups || []) || [];

  useEffect(() => {
    if (!record) return;

    const fetchApi = async () => {
      const lecturersData = await getLecturerCoursesByCourseId(record.Id_Course);
      setLecturers(lecturersData);

      const initialAssignments = {};
      allGroups.forEach(group => {
        initialAssignments[group.id] = group.teachingAssignments?.map(assign => assign.lecturerId) || [];
      });
      setSelectedLecturers(initialAssignments);
    };

    fetchApi();
  }, [record]);

  const handleLecturerChange = (groupId, value) => {
    setSelectedLecturers(prev => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const handleBackClick = () => {
	navigate("/admin/teaching-assignment", {
	            state: { selectedCycle, selectedFaculty },
	 });
  };

  const handleSubmit = async () => {
    const unassignedGroups = allGroups.filter(group => !selectedLecturers[group.id] || selectedLecturers[group.id].length === 0);

    if (unassignedGroups.length > 0) {
      message.warning("Vui lòng chọn giảng viên cho tất cả các nhóm trước khi xác nhận.");
      return;
    }

    try {
      const toCreate = [];
      const toDelete = [];

      allGroups.forEach(group => {
        const newLecturers = selectedLecturers[group.id] || [];
        const oldAssignments = group.teachingAssignments || [];

        const oldLecturerMap = new Map();
        oldAssignments.forEach(assign => {
          oldLecturerMap.set(assign.lecturerId, assign.id); // lecturerId -> assignmentId
        });

        const oldLecturerIds = oldAssignments.map(a => a.lecturerId);

        // Giảng viên bị xoá
        const removedLecturers = oldLecturerIds.filter(id => !newLecturers.includes(id));
        removedLecturers.forEach(lecturerId => {
          toDelete.push(oldLecturerMap.get(lecturerId));
        });

        // Giảng viên mới được thêm
        const addedLecturers = newLecturers.filter(id => !oldLecturerIds.includes(id));
        addedLecturers.forEach(lecturerId => {
          toCreate.push({
            status: 1,
            group: { id: group.id },
            lecturer: { id: lecturerId }
          });
        });
      });

      console.log("Create:", toCreate);
      console.log("Delete:", toDelete);

      // Tạo từng phân công mới
      const createPromises = toCreate.map(data => createTeachingAssignment(data));
      // Xoá từng phân công cũ
      const deletePromises = toDelete.map(id => delTeachingAssignment(id));

      await Promise.all([...createPromises, ...deletePromises]);

      message.success("Cập nhật phân công giảng dạy thành công!");
	  navigate("/admin/teaching-assignment", {
	            state: { selectedCycle, selectedFaculty },
	   });
    } catch (err) {
      console.error(err);
      message.error("Đã xảy ra lỗi khi cập nhật.");
    }
  };



  const dataSource = allGroups.map(group => ({
    key: `${record.Id_Course}-${group.id}`,
    Id_Course: record.Id_Course,
    Name_Course: record.Name_Course,
    GroupId: group.id,
    GroupNumber: group.groupNumber,
  }));

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
      title: 'Chỉnh sửa giảng viên (ID)',
      key: 'lecturerIds',
      render: (text, record) => (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Chọn mã CBGD"
          value={selectedLecturers[record.GroupId] || []}
          onChange={(value) => handleLecturerChange(record.GroupId, value)}
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
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackClick}
        style={{
          marginBottom: "16px",
          backgroundColor: "#FF8C00",
          borderColor: "#FF8C00",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        Quay lại
      </Button>

      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa phân công giảng dạy</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
          pagination={false}
        />

        <div className="mt-6 flex justify-end">
          <Button
            type="primary"
            className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]"
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTeachingAssignment;
