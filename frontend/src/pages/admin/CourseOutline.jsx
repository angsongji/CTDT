import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Modal, Form, message, Input, InputNumber } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAll as getAllOutlines, create } from '../../services/courseOutlineServices';
import { getAllCourses } from '../../services/courseServices';

/**
 * Component hiển thị danh sách môn học có đề cương chi tiết
 */
function CourseOutline() {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [courseOutlines, setCourseOutlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Tải dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách đề cương chi tiết
        const outlineData = await getAllOutlines();
        setCourseOutlines(outlineData);
		console.log(outlineData);
        
        // Lọc và chuyển đổi dữ liệu để lấy thông tin course
        const uniqueCourses = Array.from(new Set(outlineData.map(item => item.course.id)))
          .map(id => {
            const courseData = outlineData.find(item => item.course.id === id);
            return {
              id: courseData.course.id,
              name: courseData.course.name,
              credits: courseData.course.credits,
              key: courseData.course.id
            };
          });
        setCourses(uniqueCourses);

        // Lấy danh sách tất cả học phần
        const allCoursesData = await getAllCourses();
		console.log(allCoursesData);
        setAllCourses(allCoursesData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc danh sách học phần chưa có đề cương chi tiết
  const availableCourses = allCourses.filter(course => 
    !courses.some(existingCourse => existingCourse.id === course.id)
  );

  // Xử lý khi chọn học phần
  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    form.setFieldsValue({ parentId: undefined }); // Reset mục cha khi chọn học phần mới
  };

  // Xử lý thêm đề cương chi tiết
  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const selectedCourse = allCourses.find(course => course.id === values.courseId);
      if (selectedCourse) {
        // Tạo dữ liệu đề cương chi tiết
        const outlineData = {
          course: { id: selectedCourse.id },
          assessmentUnit: values.assessmentUnit,
          componentScore: values.componentScore,
          assessmentMethod: values.assessmentMethod,
          weight: values.weight,
          parent: values.parentId ? { id: values.parentId } : null,
          status: 1
        };

        // Gọi API tạo đề cương chi tiết mới
        const response = await create(outlineData);
        
        if (response) {
          message.success('Thêm đề cương chi tiết thành công');
          // Cập nhật lại danh sách đề cương chi tiết
          const outlineData = await getAllOutlines();
          setCourseOutlines(outlineData);
          
          // Cập nhật lại danh sách học phần có đề cương chi tiết
          const uniqueCourses = Array.from(new Set(outlineData.map(item => item.course.id)))
            .map(id => {
              const courseData = outlineData.find(item => item.course.id === id);
              return {
                id: courseData.course.id,
                name: courseData.course.name,
                credits: courseData.course.credits,
                key: courseData.course.id
              };
            });
          setCourses(uniqueCourses);

          // Chuyển đến trang chi tiết
          navigate(`/admin/course-outline/${selectedCourse.id}`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi thêm đề cương chi tiết:', error);
      message.error('Lỗi khi thêm đề cương chi tiết');
    } finally {
      setLoading(false);
      setModalVisible(false);
      form.resetFields();
      setSelectedCourseId(null);
    }
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: 'Mã học phần',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credits',
      key: 'credits',
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/course-outline/${record.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách môn học có đề cương chi tiết</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Thêm đề cương chi tiết
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Table
          columns={columns}
          dataSource={courses}
          bordered
          pagination={false}
          loading={loading}
        />
      </div>

      <Modal
        title="Thêm đề cương chi tiết"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedCourseId(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleAdd}
          layout="vertical"
          initialValues={{
            courseId: undefined,
            assessmentUnit: '',
            componentScore: '',
            assessmentMethod: '',
            weight: undefined,
            parentId: undefined
          }}
        >
          <Form.Item
            name="courseId"
            label="Chọn học phần"
            rules={[{ required: true, message: 'Vui lòng chọn học phần' }]}
          >
            <Select
              placeholder="Chọn học phần"
              loading={loading}
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              onChange={handleCourseChange}
            >
              {allCourses.map(course => (
                <Select.Option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assessmentUnit"
            label="Bộ phận được đánh giá"
            rules={[{ required: true, message: 'Vui lòng nhập bộ phận được đánh giá' }]}
          >
            <Input placeholder="Nhập bộ phận được đánh giá" />
          </Form.Item>

          <Form.Item
            name="componentScore"
            label="Điểm đánh giá bộ phận"
            rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá bộ phận' }]}
          >
            <Input placeholder="Nhập điểm đánh giá bộ phận" />
          </Form.Item>

          <Form.Item
            name="assessmentMethod"
            label="Hình thức đánh giá"
          >
            <Input placeholder="Nhập hình thức đánh giá" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Trọng số"
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="Nhập trọng số (0-1)"
            />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Mục cha"
            dependencies={['courseId']}
          >
            <Select
              placeholder="Chọn mục cha (nếu có)"
              allowClear
              style={{ width: '100%' }}
              disabled={!selectedCourseId}
            >
              {courseOutlines
                .filter(outline => outline.course.id === selectedCourseId)
                .map(outline => (
                  <Select.Option key={outline.id} value={outline.id}>
                    {outline.assessmentUnit} - {outline.componentScore}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button type="default" onClick={() => {
              setModalVisible(false);
              form.resetFields();
              setSelectedCourseId(null);
            }} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CourseOutline;
