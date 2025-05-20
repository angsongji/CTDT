import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Input, Button, Table, Select } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { getAll as getTeachingPlan } from "../../services/teachingPlanServices";
import  { toSlug } from "../../helpers/regex";

const { Option } = Select;

const TeachingAssignment = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [trainingCycle, setTrainingCycle] = useState([]);
  const [teachingPlans, setTeachingPlans] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTcf, setSelectedTcf] = useState(null);
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
    const fetchAPI = async () => {
      const cycles = await getAllTraningCycle();
	  const teachings = await getTeachingPlan();
	  
      setTrainingCycle(cycles);
	  setTeachingPlans(teachings);
    };
    fetchAPI();
  }, []);
  
  
  useEffect(() => {
    const fetchAPI = async () => {
      if (selectedCycle && selectedFaculty){
		const selectedCycleObj = trainingCycle.find(c => c.id === selectedCycle);
		const selectedFacultyObj = selectedCycleObj?.faculties.find(f => f.id === selectedFaculty.facultyId);
		const selectedTcf = selectedFacultyObj?.trainingCycleFacultyList.find(
        	tcf => tcf.id === selectedFaculty.tcfId
      	);  
		setSelectedTcf(selectedTcf);
		
		const filterFaculty = teachingPlans.filter(item =>
		  item.generalInformation.id === selectedTcf.generalInformation.id &&
		  item.course?.groupOpeningPlans &&
 		  item.course.groupOpeningPlans.length !== 0
	  	);
		
		console.log("filterFaculty", filterFaculty);
		
		const data = filterFaculty
		  .filter(item =>{
			const planImplementationSemester = item.implementationSemester; 
			return item.course.groupOpeningPlans?.some(group =>
				group.trainingCycleFacultyId === selectedTcf?.generalInformation.trainingCycleFacultyId &&
		      	group.groups?.some(g => g.teachingAssignments?.length > 0) &&
			  	planImplementationSemester == group.implementationSemester 
		    )})
		  .map(item => ({
		    ...item,
		    Id_Course: item.course.id,
		    Name_Course: item.course.name,
			groups: item.course.groupOpeningPlans 
               ?.filter(groupOpeningPlan => 
				groupOpeningPlan.trainingCycleFacultyId === selectedTcf?.generalInformation.trainingCycleFacultyId
				&& groupOpeningPlan.implementationSemester === item.implementationSemester
				) 
               .map(groupOpeningPlan => ({
                   ...groupOpeningPlan,
                   groups: groupOpeningPlan.groups?.filter(g => g.teachingAssignments?.length > 0) || [],
               })) || [],
		  	}));		  
		  console.log("data",data);
		  setDataSource(data);
		  setFilteredData(data);
	  }
	  		
     }
	  fetchAPI();
  }, [selectedCycle, selectedFaculty, teachingPlans]);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => index + 1,
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
	  render: (_, record) => {
	    const groupList = record.groups?.[0]?.groups || [];
	    return (
	      <div>
	        {groupList.map((group, idx) => (
	          <div key={idx}>{group.id}</div>
	        ))}
	      </div>
	    );
	  },
	},
	{
	  title: 'Mã CBGD',
	  key: 'Id_Lecturer',
	  render: (_, record) => {
	    const groupList = record.groups?.[0]?.groups || [];
	    return (
	      <div>
	        {groupList.map((group, idx) => {
	          const lecturerIds = group.teachingAssignments
	            ?.map(ta => ta.lecturerId)
	            .filter((v, i, a) => a.indexOf(v) === i) 
	            .join(', ');
	          return <div key={idx}>{lecturerIds || "Chưa phân công"}</div>;
	        })}
	      </div>
	    );
	  },
	},
	{
	  title: 'Họ và tên CBGD',
	  key: 'Name_Lecturer',
	  render: (_, record) => {
	    const lecturerMap = new Map();
	    record.course.lecturers.forEach(lc => {
	      lecturerMap.set(lc.id, lc.fullName);
	    });

	    const groupList = record.groups?.[0]?.groups || [];
	    return (
	      <div>
	        {groupList.map((group, idx) => {
	          const lecturerNames = group.teachingAssignments
	            ?.map(ta => lecturerMap.get(ta.lecturerId) || "Chưa cập nhật")
	            .filter((v, i, a) => a.indexOf(v) === i) 
	            .join(', ');
	          return <div key={idx}>{lecturerNames || "Chưa phân công"}</div>;
	        })}
	      </div>
	    );
	  }
	},
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', marginRight: '10px' }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (record) => {
    const slug = toSlug(record.Name_Course);
    navigate(`/admin/teaching-assignment/edit/${slug}`, { state: { record ,selectedCycle, selectedFaculty } });
  };

  const handleTrainingCycleChange = (value) => {
    setSelectedCycle(value);
    setSelectedFaculty(null); 
  };

  const handleFacultyChange = (value) => {
	const [facultyId, tcfId] = value.split('-').map(Number);
    setSelectedFaculty({ facultyId, tcfId });
  };

  const handleSummaryClick = () => {
	navigate(`/admin/teaching-assignment/statistics`, { state: { selectedCycle, selectedFaculty } })
  };
  
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    if (lowerSearch === '') {
      setFilteredData(dataSource); 
    } else {
      const result = dataSource.filter((item) => {
        const idMatch = item.Id_Course.toString().includes(lowerSearch);
        const nameMatch = item.Name_Course.toLowerCase().includes(lowerSearch);
        return idMatch || nameMatch;
      });

      setFilteredData(result);
    }
  }, [searchTerm]);

  console.log("dataSource", dataSource);

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

        <div className="flex items-center mb-4 gap-4">
          <Select
		    allowClear
            placeholder="Chọn chu kỳ đào tạo"
            value={selectedCycle}
            onChange={handleTrainingCycleChange}
            style={{ width: 200 }}
          >
            {trainingCycle.map(cycle => (
              <Option key={cycle.id} value={cycle.id}>{cycle.name}</Option>
            ))}
          </Select>

          <Select
		  	allowClear
            placeholder="Chọn ngành"
            style={{ width: 250 }}
            value={selectedFaculty ? `${selectedFaculty.facultyId}-${selectedFaculty.tcfId}` : undefined}
            onChange={handleFacultyChange}
            disabled={!selectedCycle}
          >
		  	{selectedCycle &&
                trainingCycle.find(cycle => cycle.id === selectedCycle)?.faculties?.flatMap(faculty => {
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
                        {faculty.name} ({tcf.generalInformation?.language})
                      </Option>
                    ));
                })
              }
          </Select>

          <Button type="primary" onClick={handleSummaryClick}>
            Tổng hợp Thống kê phân công
          </Button>
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
