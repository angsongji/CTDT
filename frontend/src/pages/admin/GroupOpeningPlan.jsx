import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { editGroupOpenPlan } from "../../services/groupOpeningPlanServices";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import Swal from 'sweetalert2';

const { Option } = Select;

function GroupOpeningPlan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trainingCycleList, setTrainingCycleList] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [reset, setReset] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const trainingCycles = await getAllTraningCycle();
        setTrainingCycleList(trainingCycles);
      } catch (error) {
        console.error("Error fetching training cycles:", error);
      }
    };
    fetchApi();
  }, [reset]);

  useEffect(() => {
    if (selectedCycle && selectedFaculty) {
      const selectedCycleData = trainingCycleList.find(cycle => cycle.id === selectedCycle);
      const selectedFacultyData = selectedCycleData?.faculties.find(faculty => faculty.id === selectedFaculty);

      const result = [];

      selectedFacultyData?.generalInformations?.forEach((info) => {
        info.curriculumFramework?.courses?.forEach((course) => {
          course.groupOpeningPlans?.forEach((plan) => {
            result.push({
              key: result.length + 1,
              nameCourse: course.name,
              numberOfGroups: plan.numberOfGroups,
              numberOfStudents: plan.numberOfStudents,
              status: plan.status,
              id: plan.id,
            });
          });
        });
      });

      console.log("filteredData", result);
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [selectedCycle, selectedFaculty, trainingCycleList]);


  const handleCycleChange = (value) => {
    setSelectedCycle(value);
    setSelectedFaculty(null);
  };

  const handleFacultyChange = (value) => {
    setSelectedFaculty(value);
  };

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
        const planToDelete = trainingCycleList.find(item => item.id === id);
        if (!planToDelete) return;

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
            style={{ backgroundColor: '#007bff', marginRight: '10px' }}
            onClick={() => handleDetail(record.id)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: '#F44336' }}
            onClick={() => handleDel(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kế hoạch mở nhóm</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 mb-10 items-center">
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            allowClear
            placeholder="Chọn chu kỳ đào tạo"
            style={{ width: 250 }}
            value={selectedCycle}
            onChange={handleCycleChange}
          >
            {trainingCycleList.map(cycle => (
              <Option key={cycle.id} value={cycle.id}>{cycle.name}</Option>
            ))}
          </Select>

          <Select
            allowClear
            placeholder="Chọn chương trình đào tạo"
            style={{ width: 300 }}
            value={selectedFaculty}
            onChange={handleFacultyChange}
            disabled={!selectedCycle}
          >
            {selectedCycle &&
              trainingCycleList
                .find(cycle => cycle.id === selectedCycle)
                ?.faculties
                .map(faculty => (
                  <Option key={faculty.id} value={faculty.id}>{faculty.name}</Option>
                ))
            }
          </Select>

          <Link to="/admin/group-opening-plan/create" className="ml-auto">
            <Button type="primary" className="!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]">
              <span className="text-white flex items-center gap-1"><FaPlus /> Thêm</span>
            </Button>
          </Link>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          scrollToFirstRowOnChange
        />
      </div>
    </div>
  );
}

export default GroupOpeningPlan;
