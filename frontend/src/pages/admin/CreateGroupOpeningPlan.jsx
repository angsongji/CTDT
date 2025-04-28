import { Button, Form, Input, Space, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CreateGroupOpeningPlan() {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState(false);
    const [courses, setCourses] = useState([]);

    const handleFieldChange = () => {
        const nameField = form.getFieldValue("course_id");
        const semesterField = form.getFieldValue("implementationSemester"); 
        setSubmittable(!!nameField && !!semesterField); 
    };

    const semester = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
		{ value: 6, label: '6' },
		{ value: 7, label: '7' },
		{ value: 8, label: '8' },
    ];
    
    useEffect(() => {
        const fetchAPI = async () => {
            const res = await fetch(`http://localhost:8081/api/courses`);
            const result = await res.json();
            const dataNew = result.map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
            }));
            setCourses(dataNew);
        };
        fetchAPI();
    },[]);

    //console.log(courses);
	
	const onFinish = async (values) => {
	    console.log('data:', values);
		try {
	        const response = await fetch(`http://localhost:8081/api/group-open-plan/create`, {
	            method: "POST",
	            headers: {
	                Accept: "application/json",
	                "Content-Type": "application/json",
	            },
	            body: JSON.stringify(values),
	        });

	        const result = await response.json();

	        if (result) { 
	            Swal.fire({
	                title: "Tạo thành công!",
	                text: "Mở nhóm học mới đã được thêm.",
	                icon: "success",
	                confirmButtonText: "OK"
	            }).then(() => {
	                navigate("/admin/group-opening-plan");
	            });
	        } 
	    } catch (error) {
	        console.error('Lỗi:', error);
	        Swal.fire({
	            title: "Lỗi!",
	            text: "Đã xảy ra lỗi khi tạo mở nhóm học mới.",
	            icon: "error",
	            confirmButtonText: "OK"
	        });
	    }
	};

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Mở lớp mới</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <Form
                        form={form}
                        name="validateOnly"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onFinish}
                        initialValues={{
                            NumberOfGroups: 1,
                            NumberOfStudents: 30,
                        }}
                        onValuesChange={handleFieldChange}  // Detect changes to form fields
                    >
                        <div className="flex space-x-6 justify-between w-full">
                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="course_id"
                                label="Tên học phần"
                                rules={[{ required: true, message: 'Tên học phần là bắt buộc!' }]}>
                                <Select
                                    placeholder="Chọn học phần"
                                    className="border rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500"
                                >
                                    {courses.map(course => (
                                        <Select.Option key={course.value} value={course.value}>
                                            {course.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="implementationSemester"
                                label="Học kỳ"
                                rules={[{ required: true, message: 'Học kỳ là bắt buộc!' }]}>
                                <Select
                                    placeholder="Học kỳ"
                                    className="border rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500"
                                >
                                    {semester.map(semester => (
                                        <Select.Option key={semester.value} value={semester.value}>
                                            {semester.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="flex space-x-6 justify-between w-full">
                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="numberOfGroups"
                                label="Số lượng Nhóm"
                                rules={[{ required: true, message: 'Số lượng Nhóm là bắt buộc!' }]}>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    className="border rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="numberOfStudents"
                                label="Số Sinh Viên"
                                rules={[{ required: true, message: 'Số Sinh Viên là bắt buộc!' }]}>
                                <InputNumber
                                    min={30}
                                    max={1000}
                                    className="border rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Space className="flex justify-end w-full">
                                <Button
                                    onClick={() => navigate(-1)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={!submittable}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Tạo mới
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default CreateGroupOpeningPlan;
