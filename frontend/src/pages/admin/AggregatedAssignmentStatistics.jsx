import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { getAll as getTeachingPlan } from "../../services/teachingPlanServices";
import * as XLSX from "xlsx";
import { message } from "antd";

function AggregatedAssignmentStatistics() {
	
  const location = useLocation();
  const { selectedCycle, selectedFaculty } = location.state || {};
  const [trainingCycle, setTrainingCycle] = useState([]);
  const [teachingPlans, setTeachingPlans] = useState([]);
  const [lecturersData, setLecturersData] = useState([]);
  const navigate = useNavigate();


  const semestersOrder = [
    "DH", "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12"
  ];

  const handleExport = (lecturersData) => {
      const headerRow = [
        "STT", "Mã CB", "Họ và tên GV", "", "Năm sinh", "Chức danh, học vị",
        "Tên học phần", "Mã học phần", "Số TC", "Số tiết của HP", "Số lượng lớp, nhóm",
        "Giảng dạy ở học kỳ", "", "", "", "", "", "", "", "", "", "", "",
        "Tổng số tiết giảng dạy của GV"
      ];

      const subHeaderRow1 = [
        "", "", "Họ", "Tên", "", "",
        "", "", "", "", "",
        "ĐH", "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12",
        ""
      ];

      const data = [headerRow, subHeaderRow1];

      lecturersData.forEach((lecturer) => {
        lecturer.teachingAssign.forEach((course, index) => {
          const row = [
            index === 0 ? lecturer.stt : "",
            index === 0 ? lecturer.code : "",
            index === 0 ? lecturer.lastName : "",
            index === 0 ? lecturer.firstName : "",
            index === 0 ? lecturer.birthYear : "",
            index === 0 ? lecturer.title : "",
            course.courseName,
            course.courseCode,
            course.credits,
            course.teachingHours,
            course.classCount,
            course.semesters?.["DH"] || "", // Lấy trực tiếp giá trị ĐH
            ...semestersOrder.slice(1).map(sem => course.semesters?.[sem] || ""), // Lấy các học kỳ còn lại
            course.teachingHours * course.classCount,
          ];
          data.push(row);
        });

        // Dòng tổng cộng
        const totalTeachingHours = lecturer.teachingAssign.reduce(
          (sum, c) => sum + c.teachingHours * c.classCount,
          0
        );

        const totalRow = Array(headerRow.length).fill("");
        totalRow[6] = "Tổng";
        totalRow[headerRow.length - 1] = totalTeachingHours;
        data.push(totalRow);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Merge ô
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // STT
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Mã CB
        { s: { r: 0, c: 2 }, e: { r: 1, c: 3 } }, // Họ và tên GV
        { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Năm sinh
        { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Chức danh, học vị
        { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }, // Tên học phần
        { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } }, // Mã học phần
        { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }, // Số TC
        { s: { r: 0, c: 9 }, e: { r: 1, c: 9 } }, // Số tiết của HP
        { s: { r: 0, c: 10 }, e: { r: 1, c: 10 } }, // Số lượng lớp nhóm
        { s: { r: 0, c: 11 }, e: { r: 0, c: 11 + semestersOrder.length - 1 } }, // Giảng dạy ở học kỳ
        // Các học kỳ con
        ...semestersOrder.map((sem, i) => ({
          s: { r: 1, c: 11 + i }, e: { r: 1, c: 11 + i }
        })),
        { s: { r: 0, c: headerRow.length - 1 }, e: { r: 1, c: headerRow.length - 1 } }, // Tổng số tiết
      ];

      // Style
      const borderStyle = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      const alignment = { vertical: "center", horizontal: "center", wrapText: true };
      const boldFont = { name: "Arial", sz: 11, bold: true };
      const normalFont = { name: "Arial", sz: 11 };

      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            border: borderStyle,
            alignment: alignment,
            font: (R === 0 || R === 1) ? boldFont : normalFont,
          };
          // Tô đậm dòng "Tổng"
          if (worksheet[cellAddress].v === "Tổng") {
            worksheet[cellAddress].s.font = boldFont;
          }
        }
      }

      worksheet["!cols"] = [
        { width: 5 },   // STT
        { width: 10 },  // Mã CB
        { width: 15 },  // Họ
        { width: 15 },  // Tên
        { width: 10 },  // Năm sinh
        { width: 20 },  // Chức danh
        { width: 30 },  // Tên học phần
        { width: 15 },  // Mã học phần
        { width: 8 },   // Số TC
        { width: 12 },  // Số tiết
        { width: 12 },  // Số lớp
        ...Array(semestersOrder.length).fill({ width: 8 }), // Học kỳ
        { width: 15 },  // Tổng tiết
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PhanCong");

      XLSX.writeFile(workbook, `phan_cong_giang_vien_${Date.now()}.xlsx`);
      message.success("Xuất file Excel thành công!");
    };

    
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
       if (selectedCycle && selectedFaculty) {
         const selectedCycleObj = trainingCycle.find(c => c.id === selectedCycle);
         const selectedFacultyObj = selectedCycleObj?.faculties.find(f => f.id === selectedFaculty.facultyId);
         const selectedTcf = selectedFacultyObj?.trainingCycleFacultyList.find(
           tcf => tcf.id === selectedFaculty.tcfId
         );
	 
		 const teaching = teachingPlans.filter(item =>
	 		  item.generalInformation.id === selectedTcf.generalInformation.id
		 );
		 
		 console.log("teaching", teaching)		 		
		   
		 const data = teaching.filter(item => { 
		     const planImplementationSemester = item.implementationSemester; 
		     return item.course.groupOpeningPlans?.some(group =>
		         group.trainingCycleFacultyId === selectedTcf?.generalInformation.trainingCycleFacultyId &&
		         group.groups?.some(g => g.teachingAssignments?.length > 0) &&
		         planImplementationSemester === group.implementationSemester 
		     );
		 }).map(item => ({
	                ...item,
	                Id_Course: item.course.id,
	                Name_Course: item.course.name,
	                groups: item.course.groupOpeningPlans 
	                   ?.filter(
							groupOpeningPlan => groupOpeningPlan.trainingCycleFacultyId === selectedTcf?.generalInformation.trainingCycleFacultyId
							&& groupOpeningPlan.implementationSemester === item.implementationSemester
						) 
	                   .map(groupOpeningPlan => ({
	                       ...groupOpeningPlan,
	                       groups: groupOpeningPlan.groups?.filter(g => g.teachingAssignments?.length > 0) || [],
	                   })) || [],
	                lecturers: item.course.lecturers,
	                courseInfo: {
	                  id: item.course.id,
	                  name: item.course.name,
	                  credits: item.course.credits,
	                  internshipHours: item.course.internshipHours,
	                  lectureHours: item.course.lectureHours,
	                  practiceHours: item.course.practiceHours,
	                  weightingFactor: item.course.weightingFactor,
	                  implementationSemester: item.implementationSemester,
	                },
              }));
		   
		   console.log("data", data);
		   
		   const allLecturersWithGroupCount = data.reduce((acc, currentItem) => {
         if (currentItem.lecturers && Array.isArray(currentItem.lecturers)) {
           currentItem.lecturers.forEach(lecturer => {
             const lecturerGroupCount = currentItem.groups.reduce((totalGroups, groupOpeningPlan) => {
               const count = groupOpeningPlan.groups?.filter(group =>
                 group.teachingAssignments?.some(assignment => assignment.lecturerId === lecturer.id)
				 
               ).length || 0;
               return totalGroups + count;
             }, 0);

             const existingLecturerIndex = acc.findIndex(
               (item) => item.lecturer.id === lecturer.id
             );

             const lecturerCourseInfo = {
               courseId: currentItem.courseInfo.id,
               courseName: currentItem.courseInfo.name,
               groupCount: lecturerGroupCount,
             };
			 console.log("lecturerCourseInfo", lecturerCourseInfo)

             if (existingLecturerIndex === -1) {
               acc.push({
                 lecturer: { ...lecturer },
                 courses: [lecturerCourseInfo],
                 courseInfos: [currentItem.courseInfo], 
               });
             } else {
               const existingCourseIndex = acc[existingLecturerIndex].courses.findIndex(
                 (course) => course.courseId === currentItem.courseInfo.id
               );
               if (existingCourseIndex === -1) {
                 acc[existingLecturerIndex].courses.push(lecturerCourseInfo);
                 acc[existingLecturerIndex].courseInfos.push(currentItem.courseInfo);
               } else {
                 acc[existingLecturerIndex].courses[existingCourseIndex].groupCount += lecturerGroupCount;
               }
             }
           });
         }
         return acc;
       }, []);

         const lecturersData = allLecturersWithGroupCount.map((lecturerInfo, index) => {
           const teachingAssign = lecturerInfo.courses.map((course, courseIndex) => {
             const semesterData = {};
             for (let i = 1; i <= 12; i++) {
               semesterData[i] = 0; 
             }
             semesterData[lecturerInfo.courseInfos[courseIndex]?.implementationSemester] = course.groupCount;

             return {
               courseName: course.courseName,
               courseCode: lecturerInfo.courseInfos[courseIndex]?.id, // Sử dụng courseId làm courseCode (nếu cần)
               credits: lecturerInfo.courseInfos[courseIndex]?.credits,
               teachingHours: lecturerInfo.courseInfos[courseIndex]?.lectureHours + lecturerInfo.courseInfos[courseIndex]?.practiceHours,
               classCount: course.groupCount,
               semesters: semesterData,
               otherHours: lecturerInfo.courseInfos[courseIndex]?.internshipHours, // Ví dụ
             };
           });

           return {
             stt: index + 1,
             code: lecturerInfo.lecturer.id, // Sử dụng id giảng viên làm code
             lastName: lecturerInfo.lecturer.fullName.split(' ').slice(0, -1).join(' '), // Tách họ
             firstName: lecturerInfo.lecturer.fullName.split(' ').slice(-1).join(' '), // Tách tên
             birthYear: new Date(lecturerInfo.lecturer.dateOfBirth).getFullYear(),
             title: lecturerInfo.lecturer.academicTitle,
             teachingAssign: teachingAssign,
           };
         });

         console.log("lecturersData", lecturersData);
		 setLecturersData(lecturersData);
       }
     };
     fetchAPI();
   }, [selectedCycle, selectedFaculty, teachingPlans]);
   
  const handleBack = () => {
	navigate(`/admin/teaching-assignment`, { state: { selectedCycle, selectedFaculty } })
  }
  
  return (
	<>
		<div className="flex justify-between mb-5">
		  <button
		    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
		    onClick={handleBack} 
		  >
		    Trở lại
		  </button>
	
		  <button
		    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
		    onClick={() => handleExport(lecturersData)}
		  >
		    Xuất Excel
		  </button>
		</div>
		<div className="overflow-x-auto p-4 bg-white shadow rounded-lg">
		  <h2 className="text-xl font-bold mb-6 text-center uppercase text-gray-800">
		    Bảng phân công công tác của cán bộ, giảng viên cơ hữu
		  </h2>
		  <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-700">
		    <thead className="bg-gray-100">
		      <tr>
		        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">STT</th>
		        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Mã CB</th>
		        <th colSpan={2} rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Họ và tên GV</th>
		        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Năm sinh</th>
		        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Chức danh, học vị</th>
		        <th colSpan={17} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Phân công giảng dạy</th>
		      </tr>
		      <tr>
		        <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Tên học phần</th>
		        <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Mã học phần</th>
		        <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Số TC</th>
		        <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Số tiết của HP</th>
		        <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Số lượng lớp, nhóm</th>
		        <th colSpan={11} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Giảng dạy ở học kỳ</th>
		        <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Tổng số tiết giảng dạy của GV</th>
		      </tr>
		      <tr>
		        <th className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">ĐH</th>
		        {["1","2","3","4","5","6","7","8","9","11","12"].map((sem) => (
		          <th key={sem} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">{sem}</th>
		        ))}
		      </tr>
		    </thead>
		    <tbody>
		      {lecturersData.map((lecturer) => {
		        const rowsCount = lecturer.teachingAssign.length;

		        return (
		          <React.Fragment key={lecturer.code}>
		            {lecturer.teachingAssign.map((course, i) => (
		              <tr key={course.courseCode + i} className="even:bg-gray-50">
		                {i === 0 && (
		                  <>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">{lecturer.stt}</td>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">{lecturer.code}</td>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-left align-middle">{lecturer.lastName}</td>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-left align-middle">{lecturer.firstName}</td>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">{lecturer.birthYear}</td>
		                    <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">{lecturer.title}</td>
		                  </>
		                )}

		                <td className="border border-gray-300 px-3 py-1 text-left">{course.courseName}</td>
		                <td className="border border-gray-300 px-3 py-1 text-center">{course.courseCode}</td>
		                <td className="border border-gray-300 px-3 py-1 text-center">{course.credits}</td>
		                <td className="border border-gray-300 px-3 py-1 text-center">{course.teachingHours}</td>
		                <td className="border border-gray-300 px-3 py-1 text-center">{course.classCount}</td>
		                {semestersOrder.slice(1).map((sem) => (
		                  <td key={sem} className="border border-gray-300 px-2 py-1 text-center">{course.semesters[sem] || ""}</td>
		                ))}
		                <td className="border border-gray-300 px-3 py-1 text-center">{course.classCount * course.teachingHours}</td>
		              </tr>
		            ))}

		            {/* Dòng tổng */}
		            <tr className="bg-gray-200 font-semibold">
		              <td colSpan={22} className="border border-gray-300 px-3 py-1 text-right">Tổng</td>
		              <td className="border border-gray-300 px-3 py-1 text-center">
		                {lecturer.teachingAssign.reduce((sum, c) => sum +(c.teachingHours * c.classCount), 0)}
		              </td>
		            </tr>
		          </React.Fragment>
		        );
		      })}
		    </tbody>
		  </table>
		</div>
	</>
  );
}

export default AggregatedAssignmentStatistics;
