import React, { useState } from 'react';
import { Table } from 'antd';

function CourseList() {
  const [dataCourse, setDataCourse] = useState([
		{
			key: '1',
			id: '841302',
			name: 'Cơ sở lập trình',
			credits: 4,
			lectureHours: 45,
			practiceHours: 30,
			internshipHours: 0,
			weightingFactor: 0.8,
			require: true,
			status: 1,
			id_KnowledgeAreas: "II",
			name_KnowledgeAreas: "Chuyên nghiệp",
		},
		{
			key: '2',
			id: '861301',
			name: 'Triết học Mác – Lênin',
			credits: 3,
			lectureHours: 45,
			practiceHours: 0,
			internshipHours: 0,
			weightingFactor: 1,
			require: true,
			status: 1,
			id_KnowledgeAreas: "I",
			name_KnowledgeAreas: "Giáo dục đại cương",
		},
    {
			key: '3',
			id: '861301',
			name: 'Triết học Mác – Lênin',
			credits: 3,
			lectureHours: 45,
			practiceHours: 0,
			internshipHours: 0,
			weightingFactor: 1,
			require: false,
			status: 1,
			id_KnowledgeAreas: "I",
			name_KnowledgeAreas: "Giáo dục đại cương",
		},
	]);

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
          credits: `${optionalCredits}/10`,
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
      <h1 className="text-2xl font-bold mb-4">Danh sách khóa học</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <Table 
          columns={columns} 
          dataSource={processData()}
          bordered
          pagination={false}
          components={{
            body: {
              row: (props) => {
                const { children, ...restProps } = props;
                const isSummary = props['data-row-key']?.startsWith('area-') || 
                                props['data-row-key']?.startsWith('required-') || 
                                props['data-row-key']?.startsWith('optional-');
                return (
                  <tr {...restProps} className={isSummary ? 'font-bold' : ''}>
                    {children}
                  </tr>
                );
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default CourseList; 