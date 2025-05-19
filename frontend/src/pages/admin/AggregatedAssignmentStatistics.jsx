import React from "react";

const lecturersData = [
  {
    stt: 1,
    code: "11381",
    lastName: "Phạm",
    firstName: "Bảo",
    birthYear: 1972,
    title: "PGS. TS, GVCC",
    teachingAssign: [
      {
        courseName: "Cấu trúc rời rạc",
        courseCode: "02910291",
        credits: 4,
        teachingHours: 60,
        classCount: 2,
        semesters: {
          DH: 2,
          1: 2,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 0,
        },
        otherHours: 0,
      },
      {
        courseName: "Lập trình nâng cao",
        courseCode: "02910333",
        credits: 3,
        teachingHours: 45,
        classCount: 1,
        semesters: {
          DH: 1,
          1: 1,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 0,
        },
        otherHours: 0,
      },
      {
        courseName: "Cơ sở dữ liệu",
        courseCode: "02910444",
        credits: 3,
        teachingHours: 45,
        classCount: 1,
        semesters: {
          DH: 2,
          1: 2,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 0,
        },
        otherHours: 0,
      },
      {
        courseName: "Mạng máy tính",
        courseCode: "02910555",
        credits: 3,
        teachingHours: 45,
        classCount: 1,
        semesters: {
          DH: 1,
          1: 1,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 0,
        },
        otherHours: 0,
      },
    ],
    otherWork: "Viện trưởng KH dữ liệu",
  },
  {
    stt: 2,
    code: "11382",
    lastName: "Nguyễn",
    firstName: "Lan",
    birthYear: 1980,
    title: "TS, GVCC",
    teachingAssign: [
      {
        courseName: "Toán cao cấp",
        courseCode: "02920222",
        credits: 5,
        teachingHours: 75,
        classCount: 3,
        semesters: {
          DH: 3,
          1: 3,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 0,
        },
        otherHours: 0,
      },
      {
        courseName: "Xác suất thống kê",
        courseCode: "02920333",
        credits: 4,
        teachingHours: 60,
        classCount: 2,
        semesters: {
          DH: 2,
          1: 2,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          11: 0,
          12: 3,
        },
        otherHours: 0,
      },
    ],
    otherWork: "Phó khoa Toán",
  },
];

const semestersOrder = [
  "DH",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "11",
  "12",
];

export default function TeachingAssignTable() {
  return (
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
	        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Công tác khác</th>
	        <th rowSpan={3} className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap">Tổng số tiết công tác của GV</th>
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
	        const totalTeachingHours = lecturer.teachingAssign.reduce((sum, c) => sum + c.teachingHours, 0);
	        const otherHours = lecturer.teachingAssign.reduce((sum, c) => sum + c.otherHours, 0);

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
	                <td className="border border-gray-300 px-3 py-1 text-center">{course.otherHours}</td>

	                {i === 0 && (
	                  <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">{lecturer.otherWork}</td>
	                )}

	                {i === 0 && (
	                  <td rowSpan={rowsCount} className="border border-gray-300 px-3 py-1 text-center align-middle">
	                    {totalTeachingHours + otherHours}
	                  </td>
	                )}
	              </tr>
	            ))}

	            {/* Dòng tổng */}
	            <tr className="bg-gray-200 font-semibold">
	              <td colSpan={22} className="border border-gray-300 px-3 py-1 text-right">Tổng</td>
	              <td className="border border-gray-300 px-3 py-1 text-center">
	                {lecturer.teachingAssign.reduce((sum, c) => sum + c.classCount, 0)}
	              </td>
	              <td className="border border-gray-300 px-3 py-1 text-center">{otherHours}</td>
	              <td className="border border-gray-300 px-3 py-1 text-center">{totalTeachingHours + otherHours}</td>
	            </tr>
	          </React.Fragment>
	        );
	      })}
	    </tbody>
	  </table>
	</div>

  );
}
