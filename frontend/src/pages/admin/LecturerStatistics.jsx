// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Box,
// } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Link } from 'react-router-dom';

// const LecturerStatistics = () => {
//   const [statistics, setStatistics] = useState({
//     totalLecturers: 0,
//     lecturersByFaculty: [
//       { facultyName: "Faculty A", count: 10 },
//       { facultyName: "Faculty B", count: 15 },
//       { facultyName: "Faculty C", count: 20 },
//     ],
//     lecturersByDegree: [
//       { degree: "Bachelor", count: 25 },
//       { degree: "Master", count: 30 },
//       { degree: "Doctor", count: 35 },
//     ],
//   });

//   // useEffect(() => {
//   //   const fetchStatistics = async () => {
//   //     try {
//   //       // Replace with your actual API endpoint
//   //       const response = await axios.get('/api/statistics/lecturers');
//   //       setStatistics(response.data);
//   //     } catch (error) {
//   //       console.error('Error fetching lecturer statistics:', error);
//   //     }
//   //   };

//   //   fetchStatistics();
//   // }, []);

//   return (
//     <div className='flex flex-col gap-5 mt-10'>
//       <div className='flex justify-between items-center'>
//         <div className='flex gap-2 text-sm'>
//           <Link className="text-gray-400 p-2 rounded-md hover:bg-gray-200" to="/admin/lecturer">Quản lý giảng viên</Link>
//           <Link className="text-white bg-[var(--medium-pink)] p-2 rounded-md" to="/admin/lecturer/statistics">Thống kê</Link>
//         </div>
//       </div>


//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

//         <Grid container spacing={3}>
//           {/* Total Lecturers Card */}
//           <Grid item xs={12} md={4}>
//             <Card>
//               <CardContent>
//                 <Typography color="textSecondary" gutterBottom>
//                   Tổng số Giảng viên
//                 </Typography>
//                 <Typography variant="h3" component="div">
//                   {statistics.totalLecturers}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Lecturers by Faculty Chart */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Giảng viên theo Khoa
//               </Typography>
//               <Box sx={{ height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={statistics.lecturersByFaculty}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="facultyName" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Lecturers by Degree Table */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Giảng viên theo Học vị
//               </Typography>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Học vị</TableCell>
//                       <TableCell align="right">Số lượng</TableCell>
//                       <TableCell align="right">Tỷ lệ (%)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {statistics.lecturersByDegree.map((row) => (
//                       <TableRow key={row.degree}>
//                         <TableCell component="th" scope="row">
//                           {row.degree}
//                         </TableCell>
//                         <TableCell align="right">{row.count}</TableCell>
//                         <TableCell align="right">
//                           {((row.count / statistics.totalLecturers) * 100).toFixed(1)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//     </div>

//   );
// };

// export default LecturerStatistics;
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getAllLecturers } from '../../services/lecturerServices';
import dayjs from 'dayjs';
import { Table } from 'antd';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

const LecturerStatistics = () => {
  const [lecturers, setLecturers] = useState([]);
  const [showDetailGender, setShowDetailGender] = useState("");
  const [showDetailAge, setShowDetailAge] = useState("");
  const female = lecturers.filter((lecturer) => lecturer.gender === 'Nữ');
  const male = lecturers.filter((lecturer) => lecturer.gender === 'Nam');
    
  useEffect(() => {
    const fetchAPI = async () => {
      const result = await getAllLecturers();
      setLecturers(result);
    }
    fetchAPI();
  }, []);

  const columns = [
    {
      title: 'Mã giảng viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Bằng cấp',
      dataIndex: 'degree',
      key: 'degree',
    },
    {
      title: 'Học vị',
      dataIndex: 'academicTitle',
      key: 'academicTitle',
    },
  ];

  const GenderChart = () => {
    const chartRef = useRef();
  
    const data = {
      labels: ['Nam', 'Nữ'],
      datasets: [
        {
          data: [male.length, female.length],
          backgroundColor: ['#e4b6b6', '#CA8787'],
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Tỉ lệ giảng viên nam/nữ' },
      },
      // 👇 sự kiện onClick
      onClick: (event) => {
        const chart = chartRef.current;
  
        if (!chart) return;
  
        const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
  
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = data.labels[index];
          setShowDetailGender(label);
        }
      },
    };
  
    return <Doughnut ref={chartRef} data={data} options={options} className='cursor-pointer' />;
  };
  
  const GenderDetail= () => {
    return <div className='flex flex-col gap-5'>
      <div className='text-base text-gray-500 font-bold text-center'>Chi tiết giảng viên {showDetailGender}</div>
      <Table columns={columns} dataSource={showDetailGender == "Nam" ? male : female} pagination={{ pageSize: 5 }} scrollToFirstRowOnChange={true}/>
      </div>
  }
    

  const AgeChart = () => {
    const chartRef = useRef();
    let dataAge = [0, 0, 0, 0];
    lecturers.forEach((lecturer) => {
      const age = dayjs().diff(lecturer.dateOfBirth, 'year');
      if (age < 30) dataAge[0]++;
      else if (age <= 40) dataAge[1]++;
      else if (age <= 50) dataAge[2]++;
      else dataAge[3]++;
    });

    const data = {
      labels: ['<30', '30-40', '41-50', '>50'],
      datasets: [
        {
          label: 'Số lượng giảng viên',
          data: dataAge,
          backgroundColor: '#cc8989',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Phân bố độ tuổi giảng viên' },
      },
      scales: {
        y: { beginAtZero: true },
      },
      onClick: (event) => {
        const chart = chartRef.current;
  
        if (!chart) return;
  
        const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
  
        if (elements.length > 0) {
          const index = elements[0].index;
          const label = data.labels[index];
          setShowDetailAge(label);
        }
      },
    };
    return <Bar ref={chartRef} data={data} options={options} className='cursor-pointer' />;
 };

  const AgeDetail = () => {
    const lecturersFilter = lecturers.filter((lecturer) => {
      const age = dayjs().diff(lecturer.dateOfBirth, 'year');
      if (showDetailAge === "<30") return age < 30;
      if (showDetailAge === "30-40") return age >= 30 && age <= 40;
      if (showDetailAge === "41-50") return age >= 41 && age <= 50;
      if (showDetailAge === ">50") return age > 50;
      return false;
    });
    return (
      <div className="flex flex-col gap-5">
        <div className="text-base text-gray-500 font-bold text-center">
          Chi tiết giảng viên từ {showDetailAge} tuổi
        </div>
        <Table
          columns={columns}
          dataSource={lecturersFilter}
          pagination={{ pageSize: 5 }}
          scrollToFirstRowOnChange={true}
          rowKey="id"
        />
      </div>
    );
  };
  


  return (
    lecturers.length === 0 ? (
      <div>CHƯA CÓ DỮ LIỆU</div>
    ) : (
      <div>
        <div className='flex flex-col gap-5 mt-10'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2 text-sm'>
              <Link className="text-gray-400 p-2 rounded-md hover:bg-gray-200" to="/admin/lecturer">Quản lý giảng viên</Link>
              <Link className="text-white bg-[var(--medium-pink)] p-2 rounded-md" to="/admin/lecturer/statistics">Thống kê</Link>
            </div>
          </div>

          <div className='flex gap-5 h-full'>
            <div className="w-[25%] gap-5 flex flex-col">
              <div className="flex flex-col gap-5 bg-white p-5 justify-center items-center rounded-md" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                <div className="text-xs text-gray-500 font-semibold">Tổng số giảng viên</div>
                <div className="text-2xl font-semibold">{lecturers.length}</div>
              </div>

              <div className="flex flex-col gap-5 bg-white p-5 justify-center items-center rounded-md" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                <GenderChart />
              </div>
            </div>

            <div className="flex-1 flex-col gap-5 bg-white p-3 justify-center items-center rounded-md" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
              <AgeChart />
            </div>
          </div>
        </div>
        <div className='py-5'>
          {
            showDetailGender === "" && showDetailAge === "" && <div>Nhấn vào biểu đồ bất kì để xem thông tin chi tiết</div>
          }
          {
            showDetailGender !== "" && <GenderDetail />
          }
          {
            showDetailAge !== "" && <AgeDetail />
          }
        </div>
      </div>
    )
  );
};

export default LecturerStatistics;
