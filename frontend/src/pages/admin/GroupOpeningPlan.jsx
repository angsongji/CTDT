import React, { useEffect, useState } from 'react';
import { Input, Button, Table, Tag, Select } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { editGroupOpenPlan } from "../../services/groupOpeningPlanServices";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { getAll } from "../../services/teachingPlanServices";
import Swal from 'sweetalert2';

const { Option } = Select;

function GroupOpeningPlan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trainingCycleList, setTrainingCycleList] = useState([]);
  const [teachingPlanList, setTeachingPlanList] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [reset, setReset] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedCycle) {
      setSelectedCycle(location.state.selectedCycle);
    }
    if (location.state?.selectedFaculty) {
      setSelectedFaculty(location.state.selectedFaculty);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const trainingCycleData = await getAllTraningCycle();
        const teachingPlanData = await getAll();
        setTrainingCycleList(trainingCycleData);
        setTeachingPlanList(teachingPlanData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchApi();
  }, [reset]);

  useEffect(() => {
    if (selectedCycle && selectedFaculty) {
      const selectedCycleObj = trainingCycleList.find(c => c.id === selectedCycle);
      const selectedFacultyObj = selectedCycleObj?.faculties.find(f => f.id === selectedFaculty.facultyId);
      const selectedTcf = selectedFacultyObj?.trainingCycleFacultyList.find(
        tcf => tcf.id === selectedFaculty.tcfId
      );

      const targetTcfId = selectedTcf?.id;

      const filteredTeachingPlans = teachingPlanList.filter(
        tp => tp.generalInformation?.trainingCycleFacultyId === targetTcfId
      );

      const groupPlans = [];

      filteredTeachingPlans.forEach((plan) => {
        const course = plan.course;
        const gops = course?.groupOpeningPlans || [];
		console.log("gops",gops)

        gops.forEach(gop => {
          if (gop.trainingCycleFacultyId === targetTcfId) {
            groupPlans.push({
              key: groupPlans.length + 1,
              id: gop.id,
              nameCourse: course?.name,
              idCourse: course?.id,
              numberOfGroups: gop.numberOfGroups,
              numberOfStudents: gop.numberOfStudents,
              status: gop.status,
			  isAssigned: gop.groups.some(group => group.teachingAssignments && group.teachingAssignments.length > 0)
            });
          }
        });
      });
	  
      setFilteredData(groupPlans);
    } else {
      setFilteredData([]);
    }
  }, [selectedCycle, selectedFaculty, trainingCycleList, teachingPlanList]);


  const handleCycleChange = (value) => {
    setSelectedCycle(value);
    setSelectedFaculty(null);
  };

  const handleFacultyChange = (value) => {
    const [facultyId, tcfId] = value.split('-').map(Number);
    setSelectedFaculty({ facultyId, tcfId });
  };

  const handleEdit = (record) => {
    if (record.status === 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Không thể sửa',
        text: 'Kế hoạch mở lớp đã bị xóa và không thể sửa.',
      });
      return;
    }

    navigate(`/admin/group-opening-plan/edit/${record.id}`, {
      state: { record, selectedCycle, selectedFaculty }
    });
  };

  const handleDetail = (key) => {
    navigate(`/admin/group-opening-plan/detail/${key}`, {
      state: { selectedCycle, selectedFaculty },
    });
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
        const planToDelete = filteredData.find(item => item.id === id);
		console.log(planToDelete);
        if (!planToDelete) return;

        const updatedData = { ...planToDelete, status: 2 };
        const response = await editGroupOpenPlan(id, updatedData);
        if (response) {
          Swal.fire('Đã xóa!', 'Kế hoạch mở lớp đã được xóa thành công.', 'success');
          setReset(!reset);
        }
      } catch (error) {
        console.log("error", error);
        Swal.fire('Lỗi!', 'Không thể xóa kế hoạch mở lớp.', 'error');
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
	    let color = '';
	    let text = '';

	    switch(status) {
	      case 1:
	        color = 'green';      
	        text = 'Đang mở';
	        break;
	      case 0:
	        color = 'volcano';   
	        text = 'Đang đóng';
	        break;
	      case 2:
	        color = 'gray';     
	        text = 'Đã xóa';
	        break;
	      default:
	        color = 'default';
	        text = 'Không xác định';
	    }

	    return <Tag color={color}>{text}</Tag>;
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
            placeholder="Chọn ngành"
            style={{ width: 300 }}
            value={selectedFaculty ? `${selectedFaculty.facultyId}-${selectedFaculty.tcfId}` : undefined}
            onChange={handleFacultyChange}
            disabled={!selectedCycle}
          >
            {selectedCycle &&
              trainingCycleList.find(cycle => cycle.id === selectedCycle)?.faculties?.flatMap(faculty => {
                const list = faculty.trainingCycleFacultyList;
                const normalizedList = Array.isArray(list) ? list : list ? [list] : [];
                return normalizedList
                  .filter(
					tcf => 
						tcf?.trainingCycleId === selectedCycle &&
						tcf.generalInformation &&
				        Object.keys(tcf.generalInformation).length > 0
				  )
                  .map(tcf => (
                    <Option key={`${faculty.id}-${tcf.id}`} value={`${faculty.id}-${tcf.id}`}>
                      {tcf.generalInformation?.name} ({tcf.generalInformation?.language})
                    </Option>
                  ));
              })
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
