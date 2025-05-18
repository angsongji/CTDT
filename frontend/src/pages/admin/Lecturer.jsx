import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Input, Radio, DatePicker } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { Dropdown, Table, Modal, Select } from 'antd';
import { Link } from 'react-router-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { CiImport, CiExport } from "react-icons/ci";
import { getAllLecturers, deleteLecturer, createLecturer, updateLecturer, getLecturerById, addLecturers } from '../../services/lecturerServices';
import { getCourseByLecturerId } from '../../services/courseServices';
import { getAllCourses } from '../../services/courseServices';
import { createLecturerCourse, deleteLecturerCourse } from '../../services/lecturerCourseServices';
import { HiX } from "react-icons/hi";
import dayjs from 'dayjs';
import * as XLSX from 'xlsx-js-style';
const { confirm } = Modal;

const Lecturer = () => {
  const [lecturers, setLecturers] = useState([]);
  const [lecturerId, setLecturerId] = useState(0);
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [courses, setCourses] = useState([]);
  const fileInputRef = useRef();
  useEffect(() => {
    const fetchAPI = async () => {
      const result = await getAllLecturers();
      setLecturers(result);
    }
    fetchAPI();
    const fetchCourses = async () => {
      const result = await getAllCourses();
      setCourses(result);
    }
    fetchCourses();
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
    {
      title: "",
      key: "action",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              { key: "detail", label: "Xem học phần phụ trách giảng dạy" },
              { key: "edit", label: "Chỉnh sửa" },
              { key: "delete", label: "Xóa", danger: true },
            ],
            onClick: ({ key }) => handleMenuClick(key, record),
          }}
          trigger={["click"]}
        >
          <span className="cursor-pointer">
            <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
          </span>
        </Dropdown>
      ),
    },
  ];

  const handleMenuClick = (key, lecturer) => {
    switch (key) {
      case "detail":
        console.log("Xem thông tin chi tiết", lecturer);
        setLecturerId(lecturer.id);
        break;
      case "edit":
        setLecturerId(lecturer.id);
        setShowFormUpdate(true);
        break;
      case "delete":
        confirm({
          title: 'Bạn có chắc chắn muốn xóa?',
          content: 'Hành động này sẽ không thể hoàn tác!',
          okText: 'Xóa',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk() {
            handleDeleteLecturer(lecturer.id);
          },
          onCancel() {
            console.log('Hủy xóa');
          },
        });
        break;
      default:
        break;
    }
  };

  const handleDeleteLecturer = async (id) => {
    const result = await deleteLecturer(id);
    if (result.status === 200) {
      message.success("Xóa giảng viên thành công!");
      setLecturers(prev => prev.filter(lecturer => lecturer.id !== id));
    } else if (result.status === 409) {
      message.error(result.message);
    }
  }


  const handleExport = () => {
    //Các cột sẽ xuất hiện trong file excel
    const filteredData = lecturers.map(item => ({
      "Mã giảng viên": item.id,
      "Tên giảng viên": item.fullName,
      "Giới tính": item.gender,
      "Ngày sinh": dayjs(item.dateOfBirth).format("DD/MM/YYYY"),
      "Bằng cấp": item.degree,
      "Học vị": item.academicTitle,
      "Học phần giảng dạy": courses
        .filter(course => course.lecturers.some(lect => lect.id === item.id))
        .map(course => course.id + " - " + course.name)
        .join("\n")
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Style tất cả các ô: căn giữa các ô, nền xanh và chữ trắng cho hàng đầu (tiêu đề), font times new roman
    for (let row = range.s.r; row <= range.e.r; ++row) {
      for (let col = range.s.c; col <= range.e.c; ++col) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];
        if (!cell || !cell.s) cell.s = {};

        // Căn giữa tất cả
        cell.s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };

        //Font times new roman
        cell.s.font = { name: 'Times New Roman' };

        // Nếu là hàng tiêu đề (hàng đầu tiên)
        if (row === 0) {
          cell.s.fill = {
            fgColor: { rgb: '4472C4' } // Nền xanh dương
          };
          cell.s.font = {
            bold: true,
            color: { rgb: 'FFFFFF' } // Chữ trắng
          };
        }
      }
    }

    // Độ rộng cột
    worksheet['!cols'] = Array(range.e.c + 1).fill({ width: 20 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GiangVien"); //GiangVien là tên của sheet á

    XLSX.writeFile(workbook, `lecturers_${Date.now()}.xlsx`);
    message.success("Xuất file excel thành công!");

  };

  const exportTemplate = () => {
    const filteredData = [
      {
        "Tên giảng viên": "Nguyễn Văn A",
        "Giới tính": "Nam",
        "Ngày sinh": "01/01/2000",
        "Bằng cấp": "Thạc sĩ",
        "Học vị": "Thạc sĩ",
      },
      {
        "Tên giảng viên": "Nguyễn Văn B",
        "Giới tính": "Nữ",
        "Ngày sinh": "01/01/1998",
        "Bằng cấp": "Thạc sĩ",
        "Học vị": "Thạc sĩ",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GiangVien");

    XLSX.writeFile(workbook, `lecturer_template.xlsx`);
    message.success("Đã xuất file excel mẫu thành công!");
  };

  const afkBeforeImport = () => {
    confirm({
      title: 'Nhập file excel',
      content: 'Bạn đã có file excel mẫu để điền thông tin giảng viên chưa?',
      okText: 'Chưa có',       // Xuất file mẫu
      cancelText: 'Đã có',     // Nhập file
      onOk() {
        exportTemplate();
      },
      onCancel() {
        fileInputRef.current.click();
        message.info("Vui lòng chọn file excel muốn nhập");
      },
    });
  };

  const handleImport = async (e) => {
    const titleExcelTable = ['Tên giảng viên', 'Giới tính', 'Ngày sinh', 'Bằng cấp', 'Học vị'];
    const file = e.target.files[0];
  
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const firstRow = json[0];
      const isValid = titleExcelTable.every((title, index) => title === firstRow[index]);
  
      if (!isValid) {
        message.error("File excel không đúng định dạng!");
        fileInputRef.current.value = ""; // ✅ reset input
        return;
      }
  
      try {
        const dataAddLecturer = json.slice(1).map((row, index) => {
          const fullName = row[0]?.trim() || "";
          const gender = row[1]?.trim() || "";
          const dateOfBirth = row[2]?.trim() || "";
          const degree = row[3]?.trim() || "";
          const academicTitle = row[4]?.trim() || "";
  
          if (!fullName) throw new Error(`Dòng ${index + 2}: Tên giảng viên không được để trống!`);
          if (!gender) throw new Error(`Dòng ${index + 2}: Giới tính không được để trống!`);
          if (!dateOfBirth) throw new Error(`Dòng ${index + 2}: Ngày sinh không được để trống!`);
          if (!degree) throw new Error(`Dòng ${index + 2}: Bằng cấp không được để trống!`);
  
          return {
            fullName,
            gender,
            dateOfBirth: dateOfBirth.split('/').reverse().join('-'),
            degree,
            academicTitle,
            status: 1
          };
        });
  
        const result = await addLecturers(dataAddLecturer);
        if (result.status === 200) {
          setLecturers(prev => [...prev, ...result.data]);
          message.success("Thêm giảng viên thành công!");
        } else {
          message.error(result.message || "Có lỗi xảy ra khi thêm giảng viên.");
        }
      } catch (error) {
        message.error(error.message || "Lỗi xử lý dữ liệu!");
      }
  
      fileInputRef.current.value = ""; // ✅ reset lại input
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  
  



  const CustomButton = ({ icon, onClick, hoverText = "Click me" }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <Button
        type="primary"
        shape="circle"
        onClick={onClick}
        className={`
          transition-all duration-300 flex items-center
          !bg-[var(--dark-pink)] 
          hover:!bg-[var(--medium-pink2)]   
          ${hovered ? '!rounded-md !px-2 ' : ''}
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {icon}
        {hovered && (
          <span className="ml-2 whitespace-nowrap text-sm font-medium">
            {hoverText}
          </span>
        )}
      </Button>
    );
  };

  const TableCourseByArea = ({ lecturerId }) => {
    const [courses, setCourses] = useState([]);
    const [lecturer, setLecturer] = useState({});
    useEffect(() => {
      const fetchAPI = async () => {
        const result = await getCourseByLecturerId(lecturerId);
        setCourses(result);
        const lecturerResult = lecturers.find(item => item.id === lecturerId);
        setLecturer(lecturerResult);
      }
      fetchAPI();
    }, []);
    console.log(courses);
    return (
      <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
        <div className="w-[80%] flex flex-col items-center justify-center bg-white p-5 rounded-lg gap-5" >
          <div className="flex items-center justify-between w-full">
            <div className="text-[var(--dark-pink)] font-bold text-xl">Danh sách học phần giảng dạy</div>
            <HiX onClick={() => setLecturerId(0)} className="text-2xl cursor-pointer hover:text-red-500" />
          </div>
          <div className='w-full flex flex-col gap-5'>
            <div className='flex gap-5'>
              <div className='font-bold'>Mã giảng viên</div>
              <div>{lecturer.id}</div>
            </div>
            <div className='flex gap-5'>
              <div className='font-bold'>Tên giảng viên</div>
              <div>{lecturer.fullName}</div>
            </div>

          </div>
          {courses.length === 0 ? (
            <div>
              <div className="text-center text-gray-400 py-4">
                Giảng viên chưa đảm nhận giảng dạy học phần nào.
              </div>
            </div>
          ) :
            <table className="w-full table-auto border border-white rounded-xl overflow-hidden border-separate border-spacing-0">
              <thead className=" bg-[var(--dark-pink)] text-white">
                <tr className="text-center  ">
                  <th className="border py-2 w-[15%]">Mã học phần</th>
                  <th className="border py-2 w-auto">Tên học phần</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((item, index) => (
                  <tr key={index} className="text-[var(--dark-pink)] bg-white text-sm text-center">
                    <td className=" py-2 ">{item.id}</td>
                    <td className=" py-2 ">{item.name}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          }
        </div>

      </div>

    );
  };

  const FormAdd = () => {
    console.log(courses);
    const [dataAdd, setDataAdd] = useState({
      fullName: "",
      gender: "Nam",
      dateOfBirth: "",
      degree: "Thạc sĩ",
      academicTitle: "Giảng viên",
      status: 1
    });
    const [dataLecturerCourse, setDataLecturerCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setDataAdd(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleDateChange = (date) => {
      setDataAdd(prev => ({
        ...prev,
        dateOfBirth: date ? date.format('YYYY-MM-DD') : ''
      }));
    };

    const handleSubmitForm = async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        message.loading({ content: "Đang thêm giảng viên...", key: "add" });
        const result = await createLecturer(dataAdd);
        if (result.status === 200) {
          if (dataLecturerCourse.length === 0) {
            setLecturers(prev => [...prev, { id: result.data.id, ...dataAdd }]);
            message.success({ content: "Thêm giảng viên thành công!", key: "add", duration: 2, style: { marginTop: '1vh' } });
            setShowFormAdd(false);
            return;
          }
          dataLecturerCourse.forEach(item => {
            item.lecturer = { id: result.data.id };
          });
          console.log(dataLecturerCourse);
          const result2 = await createLecturerCourse(dataLecturerCourse);
          if (result2.status === 200) {
            console.log(result2);
            setLecturers(prev => [...prev, { id: result.data.id, ...dataAdd }]);
            message.success({ content: "Thêm giảng viên thành công!", key: "add", duration: 2, style: { marginTop: '1vh' } });
            setShowFormAdd(false);
          }
          else {
            console.log(result2);
            message.error({ content: "Thêm giảng viên thất bại!", key: "add", duration: 2, style: { marginTop: '1vh' } });
          }
        }
        else {
          console.log(result);
          message.error({ content: "Thêm giảng viên thất bại!", key: "add", duration: 2, style: { marginTop: '1vh' } });
        }

      } catch (error) {
        console.log(error);
        message.error({
          content: error.message,
          duration: 2,
          key: "add",
          style: { marginTop: '1vh' },
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
        <form onSubmit={handleSubmitForm} className="rounded-lg relative text-sm w-[50vw] flex flex-col gap-5 bg-white p-5 shadow-md">
          <div className='font-bold text-xl text-center'>Thêm giảng viên</div>
          <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 top-0 p-2'>
            <HiX size={24} />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Họ và tên</span>
            <Input
              type="text"
              required
              name="fullName"
              onChange={handleChange}
              value={dataAdd.fullName}
              placeholder="Nhập họ và tên"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Giới tính</span>
            <Radio.Group
              name="gender"
              onChange={handleChange}
              value={dataAdd.gender}
              style={{ width: "80%" }}
              disabled={isLoading}
            >
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
            </Radio.Group>
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ngày sinh</span>
            <DatePicker
              required
              onChange={handleDateChange}
              style={{ width: "80%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              disabled={isLoading}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Bằng cấp</span>
            <Input
              type="text"
              required
              name="degree"
              onChange={handleChange}
              value={dataAdd.degree}
              placeholder="Nhập bằng cấp"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Học vị</span>
            <Input
              type="text"
              name="academicTitle"
              onChange={handleChange}
              value={dataAdd.academicTitle}
              placeholder="Nhập học vị"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Học phần giảng dạy</span>
            <Select
              mode="multiple"
              style={{ width: "80%" }}
              placeholder="Chọn học phần giảng dạy"
              value={dataLecturerCourse.map(item => item.course.id)} // ✅ Sửa chỗ này
              onChange={(values) =>
                setDataLecturerCourse(
                  values.map(value => ({ course: { id: value } }))
                )
              }
              disabled={isLoading}
              optionFilterProp="children"
            >
              {courses.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>

          </div>

          <div className='flex justify-end gap-2'>
            <Button onClick={() => setShowFormAdd(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Thêm
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const FormUpdate = () => {
    const [dataUpdate, setDataUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [oldLecturerCourses, setOldLecturerCourses] = useState([]);
    useEffect(() => {
      const fetchAPI = async () => {
        const result = await getCourseByLecturerId(lecturerId);
        let oldLecturerCourses;
        if (result.length === 0) {
          oldLecturerCourses = [];
        } else {
          oldLecturerCourses = result[0].lecturers.find(item => item.id === lecturerId).lecturerCourses || [];
        }
        console.log(oldLecturerCourses);
        setOldLecturerCourses(oldLecturerCourses);
        setDataUpdate({
          ...lecturers.find(item => item.id === lecturerId),
          lecturerCourses: result.map(item => ({
            course: {
              id: item.id,
            }
          }))
        });
      }
      fetchAPI();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setDataUpdate({
        ...dataUpdate,
        [name]: value
      });
    };

    const handleDateChange = (date) => {
      setDataUpdate({
        ...dataUpdate,
        dateOfBirth: date ? date.format('YYYY-MM-DD') : ''
      });
    };

    const handleSubmitForm = async (e) => {
      e.preventDefault();
      console.log(dataUpdate);
      console.log(oldLecturerCourses);
      try {
        setIsLoading(true);
        message.loading({ content: "Đang cập nhật giảng viên...", key: "update" });
        const result = await updateLecturer(lecturerId, dataUpdate);
        if (result.status === 200) {
          const result2 = await deleteLecturerCourse(oldLecturerCourses);
          if (result2.status === 200) {
            const newLecturerCourses = dataUpdate.lecturerCourses.map(item => {
              item.lecturer = { id: lecturerId };
              return item;
            });
            console.log(newLecturerCourses);
            const result3 = await createLecturerCourse(newLecturerCourses);
            if (result3.status === 200) {
              setLecturers(prev => prev.map(item =>
                item.id === lecturerId ? { ...item, ...dataUpdate } : item
              ));
              message.success({ content: "Cập nhật giảng viên thành công!", key: "update", duration: 2, style: { marginTop: '1vh' } });
              setShowFormUpdate(false);
              setLecturerId(0);
            } else {
              console.log(result3);
              message.error({ content: "Cập nhật giảng viên thất bại 3!", key: "update", duration: 2, style: { marginTop: '1vh' } });
            }
          } else {
            console.log(result2);
            message.error({ content: "Cập nhật giảng viên thất bại 2!", key: "update", duration: 2, style: { marginTop: '1vh' } });
          }
        } else {
          console.log(result);
          message.error({ content: "Cập nhật giảng viên thất bại 1!", key: "update", duration: 2, style: { marginTop: '1vh' } });
        }
      } catch (error) {
        console.log(error);
        message.error({
          content: error.message,
          duration: 2,
          key: "update",
          style: { marginTop: '1vh' },
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
        <form onSubmit={handleSubmitForm} className="rounded-lg relative text-sm w-[50vw] flex flex-col gap-5 bg-white p-5 shadow-md">
          <div className='font-bold text-xl text-center'>Cập nhật giảng viên</div>
          <div onClick={() => { setShowFormUpdate(false); setLecturerId(0) }} className='cursor-pointer absolute right-0 top-0 p-2'>
            <HiX size={24} />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Họ và tên</span>
            <Input
              name="fullName"
              value={dataUpdate.fullName}
              onChange={handleChange}
              required
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Giới tính</span>
            <Radio.Group
              name="gender"
              value={dataUpdate.gender}
              onChange={handleChange}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
            >
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
            </Radio.Group>
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ngày sinh</span>
            <DatePicker
              value={dataUpdate.dateOfBirth ? dayjs(dataUpdate.dateOfBirth) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              placeholder='Chọn ngày sinh'
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Bằng cấp</span>
            <Input
              type="text"
              required
              name="degree"
              onChange={handleChange}
              value={dataUpdate.degree}
              placeholder="Nhập bằng cấp"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Học vị</span>
            <Input
              type="text"
              name="academicTitle"
              onChange={handleChange}
              value={dataUpdate.academicTitle}
              placeholder="Nhập học vị"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Học phần giảng dạy</span>
            <Select
              mode="multiple"
              style={{ width: "80%" }}
              placeholder="Chọn học phần giảng dạy"
              value={dataUpdate.lecturerCourses?.map(item => item.course.id)}

              onChange={(values) =>
                setDataUpdate(prev => ({
                  ...prev,
                  lecturerCourses: values.map(value => ({ course: { id: value } }))
                }))
              }
              disabled={isLoading}
              optionFilterProp="children"
            >
              {courses.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>

          </div>

          <div className='flex justify-end gap-2'>
            <Button onClick={() => { setShowFormUpdate(false); setLecturerId(0) }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>Cập nhật</Button>
          </div>
        </form>
      </div>
    );
  };


  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <Link className="text-sm text-white bg-[var(--medium-pink)] p-2 rounded-md" to="/admin/lecturer">Quản lý giảng viên</Link>
          <Link className="text-sm text-gray-400 p-2 rounded-md hover:bg-gray-200" to="/admin/lecturer/statistics">Thống kê</Link>
        </div>
        <div className='flex gap-2'>
          <CustomButton icon={<FaPlus />} onClick={() => setShowFormAdd(true)} hoverText="Thêm giảng viên" />
          <CustomButton icon={<CiImport className="text-xl" />} onClick={() => afkBeforeImport()} hoverText="Import" />
          <CustomButton icon={<CiExport className="text-xl" />} onClick={() => handleExport()} hoverText="Export" />
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: 'none' }} // ẩn input
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={lecturers}
        pagination={{ pageSize: 5 }}
        scrollToFirstRowOnChange={true}
      />
      {
        !showFormUpdate && lecturerId !== 0 && (
          <TableCourseByArea lecturerId={lecturerId} />
        )
      }
      {showFormAdd && <FormAdd />}
      {showFormUpdate && <FormUpdate />}
    </div>
  );
};

export default Lecturer; 