import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const LecturerStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalLecturers: 0,
    lecturersByFaculty: [
      { facultyName: "Faculty A", count: 10 },
      { facultyName: "Faculty B", count: 15 },
      { facultyName: "Faculty C", count: 20 },
    ],
    lecturersByDegree: [
      { degree: "Bachelor", count: 25 },
      { degree: "Master", count: 30 },
      { degree: "Doctor", count: 35 },
    ],
  });

  // useEffect(() => {
  //   const fetchStatistics = async () => {
  //     try {
  //       // Replace with your actual API endpoint
  //       const response = await axios.get('/api/statistics/lecturers');
  //       setStatistics(response.data);
  //     } catch (error) {
  //       console.error('Error fetching lecturer statistics:', error);
  //     }
  //   };

  //   fetchStatistics();
  // }, []);

  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 text-sm'>
          <Link className="text-gray-400 p-2 rounded-md hover:bg-gray-200" to="/admin/lecturer">Quản lý giảng viên</Link>
          <Link className="text-white bg-[var(--medium-pink)] p-2 rounded-md" to="/admin/lecturer/statistics">Thống kê</Link>
        </div>
      </div>


      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

        <Grid container spacing={3}>
          {/* Total Lecturers Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Tổng số Giảng viên
                </Typography>
                <Typography variant="h3" component="div">
                  {statistics.totalLecturers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Lecturers by Faculty Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Giảng viên theo Khoa
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics.lecturersByFaculty}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="facultyName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Lecturers by Degree Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Giảng viên theo Học vị
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Học vị</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Tỷ lệ (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.lecturersByDegree.map((row) => (
                      <TableRow key={row.degree}>
                        <TableCell component="th" scope="row">
                          {row.degree}
                        </TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">
                          {((row.count / statistics.totalLecturers) * 100).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

    </div>

  );
};

export default LecturerStatistics;
