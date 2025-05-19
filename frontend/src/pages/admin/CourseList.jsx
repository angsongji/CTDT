import React, { useState, useEffect } from 'react';
import { Table, Form, Row, Col, Input, Select } from 'antd';
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { getByInformationId } from '../../services/teachingPlanServices';

function CourseList() {
  const [dataCourse, setDataCourse] = useState([]);
  const [selectedTrainingCycleId, setSelectedTrainingCycleId] = useState(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [trainingCycles, setTrainingCycles] = useState([]); //Chu kỳ đào tạo
  const [form] = Form.useForm();


  // const [dataCourse, setDataCourse] = useState([
  //   {
  //     key: '1',
  //     id: '841302',
  //     name: 'Cơ sở lập trình',
  //     credits: 4,
  //     lectureHours: 45,
  //     practiceHours: 30,
  //     internshipHours: 0,
  //     weightingFactor: 0.8,
  //     require: true,
  //     status: 1,
  //     id_KnowledgeAreas: "II",
  //     name_KnowledgeAreas: "Chuyên nghiệp",
  //   },
  //   {
  //     key: '2',
  //     id: '861301',
  //     name: 'Triết học Mác – Lênin',
  //     credits: 3,
  //     lectureHours: 45,
  //     practiceHours: 0,
  //     internshipHours: 0,
  //     weightingFactor: 1,
  //     require: true,
  //     status: 1,
  //     id_KnowledgeAreas: "I",
  //     name_KnowledgeAreas: "Giáo dục đại cương",
  //   },
  //   {
  //     key: '3',
  //     id: '861301',
  //     name: 'Triết học Mác – Lênin',
  //     credits: 3,
  //     lectureHours: 45,
  //     practiceHours: 0,
  //     internshipHours: 0,
  //     weightingFactor: 1,
  //     require: false,
  //     status: 1,
  //     id_KnowledgeAreas: "I",
  //     name_KnowledgeAreas: "Giáo dục đại cương",
  //   },
  // ]);

  useEffect(() => {
    fetchTrainingCycles();
  }, []);

  useEffect(() => {
    if (!selectedTrainingCycleId || !selectedFacultyId || trainingCycles.length === 0) return;

    const selectedCycle = trainingCycles.find(tc => tc.id === selectedTrainingCycleId);
    const selectedFaculty = selectedCycle?.faculties.find(f => f.id === selectedFacultyId);

    const trainingCycleFaculty = selectedFaculty?.trainingCycleFacultyList?.find(
      tcf => tcf.trainingCycleId === selectedTrainingCycleId
    );

    const generalInfoId = trainingCycleFaculty?.generalInformation?.id;

    if (generalInfoId) {
      fetchData([generalInfoId]);
    } else {
      fetchData([]);
    }
  }, [selectedTrainingCycleId, selectedFacultyId]);

  const fetchTrainingCycles = async () => {
    const result = await getAllTraningCycle();
    setTrainingCycles(result);
  }

  const fetchData = async (idInformation = []) => {
    if (!idInformation || idInformation.length === 0) {
      setDataCourse([]);
      return;
    }

    try {
      const response = await getByInformationId(idInformation);
      console.log("response: ", response);

      if (Array.isArray(response)) {
        const courseMap = new Map(); // Map để lưu course theo id, đảm bảo không trùng

        response.forEach((item) => {
          const course = item.course || {};
          const knowledgeArea = course.knowledgeArea || {};
          const courseId = course.id;

          // Chỉ thêm vào map nếu chưa có id này
          if (!courseMap.has(courseId)) {
            courseMap.set(courseId, {
              id: courseId || '',
              name: course.name || '',
              credits: course.credits || 0,
              lectureHours: course.lectureHours || 0,
              practiceHours: course.practiceHours || 0,
              internshipHours: course.internshipHours || 0,
              weightingFactor: course.weightingFactor || 1,
              require: course.requirement ?? false,
              status: item.status ?? 1,
              id_KnowledgeAreas: knowledgeArea.id || '',
              name_KnowledgeAreas: knowledgeArea.name || '-',
            });
          }
        });

        // Chuyển giá trị trong map sang mảng và thêm key, index
        const formattedData = Array.from(courseMap.values()).map((course, index) => ({
          ...course,
          key: course.id || `key-${index}`,
          index: index + 1,
        }));

        console.log("formattedData (dùng Map): ", formattedData);
        setDataCourse(formattedData);
        setFilteredSubjects(formattedData);
      } else {
        console.error('Invalid response format:', response);
        setDataCourse([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setDataCourse([]);
    }
  };

  const columns = [
    {
      title: 'TT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, record) => {
        if (record.isSummary) return '';
        return record.index;
      }
    },
    { title: 'Mã HP', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Tên HP', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'STC', dataIndex: 'credits', key: 'credits', width: 80 },
    {
      title: 'Số tiết dạy học',
      children: [
        { title: 'LT', dataIndex: 'lectureHours', key: 'lectureHours', width: 80 },
        { title: 'TH', dataIndex: 'practiceHours', key: 'practiceHours', width: 80 },
        { title: 'TT', dataIndex: 'internshipHours', key: 'internshipHours', width: 80 },
        {
          title: 'Cộng',
          key: 'totalHours',
          width: 80,
          render: (_, record) => {
            if (record.isSummary) return record.totalHours;
            return record.lectureHours + record.practiceHours + record.internshipHours;
          },
        },
      ],
    },
    { title: 'Hệ số học phần', dataIndex: 'weightingFactor', key: 'weightingFactor', width: 120 },
  ];


  // Tính toán dữ liệu tổng hợp
  const processData = () => {
    // Nhóm theo khối kiến thức
    const groupedByArea = dataCourse.reduce((acc, curr) => {
      const area = curr.id_KnowledgeAreas;
      if (!acc[area]) {
        acc[area] = {
          required: [],
          optional: [],
          name: curr.name_KnowledgeAreas
        };
      }
      if (curr.require) {
        acc[area].required.push(curr);
      } else {
        acc[area].optional.push(curr);
      }
      return acc;
    }, {});

    // Tạo dữ liệu cho bảng
    let tableData = [];
    let index = 1;

    // Sắp xếp các khối kiến thức, đưa khối I lên đầu
    const sortedAreas = Object.entries(groupedByArea).sort(([a], [b]) => {
      if (a === 'I') return -1;
      if (b === 'I') return 1;
      const romanToNumber = (roman) => {
        const romanNumerals = { 'II': 2, 'III': 3, 'IV': 4, 'V': 5 };
        return romanNumerals[roman] || 0;
      };
      return romanToNumber(a) - romanToNumber(b);
    });

    sortedAreas.forEach(([area, data]) => {
      // Thêm dòng tổng khối kiến thức
      const totalCredits = data.required.length + data.optional.length;
      tableData.push({
        key: `area-${area}`,
        isSummary: true,
        name: `Khối kiến thức ${data.name}`,
        credits: `${totalCredits}/${totalCredits}`,
        isAreaHeader: true
      });

      // Thêm dòng tổng học phần bắt buộc
      if (data.required.length > 0) {
        const requiredCredits = data.required.reduce((sum, curr) => sum + curr.credits, 0);
        tableData.push({
          key: `required-${area}`,
          isSummary: true,
          name: 'Các học phần bắt buộc',
          credits: `${requiredCredits}/${requiredCredits}`,
          isRequiredHeader: true
        });

        // Thêm các học phần bắt buộc
        data.required.forEach(course => {
          tableData.push({
            ...course,
            index: index++
          });
        });
      }

      // Thêm dòng tổng học phần tự chọn
      if (data.optional.length > 0) {
        const optionalCredits = data.optional.reduce((sum, curr) => sum + curr.credits, 0);
        tableData.push({
          key: `optional-${area}`,
          isSummary: true,
          name: 'Các học phần tự chọn',
          credits: `${optionalCredits}/${optionalCredits}`,
          isOptionalHeader: true
        });

        // Thêm các học phần tự chọn
        data.optional.forEach(course => {
          tableData.push({
            ...course,
            index: index++
          });
        });
      }
    });

    return tableData;
  };

  return (
    <div className="p-6">
      <Form form={form} layout="inline">
        <Row justify="start" align="middle" gutter={16} className="mb-4" wrap>
          {/* Chọn chu kỳ đào tạo */}
          <Col>
            <Select
              placeholder="Chọn chu kỳ đào tạo"
              style={{ width: 200 }}
              value={selectedTrainingCycleId}
              onChange={(value) => {
                setSelectedTrainingCycleId(value);
                setSelectedFacultyId(undefined);
              }}
              options={trainingCycles.map((area) => ({
                label: `${area.id} - ${area.name}`,
                value: area.id
              }))}
              showSearch
              optionFilterProp="label"
            />
          </Col>

          {/* Chọn ngành học */}
          <Col>
            <Select
              placeholder="Chọn ngành học"
              style={{ width: 200 }}
              value={selectedFacultyId}
              onChange={(value) => {
                setSelectedFacultyId(value);
              }}
              disabled={!selectedTrainingCycleId}
              options={
                trainingCycles
                  .find((tc) => tc.id === selectedTrainingCycleId)
                  ?.faculties.map((f) => ({
                    label: f.name,
                    value: f.id
                  })) || []
              }
            />
          </Col>
        </Row>
      </Form>
      <div className="bg-white rounded-lg shadow p-6">
        <Table
          bordered
          columns={columns}
          dataSource={processData()}
          pagination={false}
          rowClassName={(record) => {
            if (record.isAreaHeader) return 'area-header';
            if (record.isRequiredHeader) return 'required-header';
            if (record.isOptionalHeader) return 'optional-header';
            return '';
          }}
        />
      </div>
    </div>
  );
};

export default CourseList; 