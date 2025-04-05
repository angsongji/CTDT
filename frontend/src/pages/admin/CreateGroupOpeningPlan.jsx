import { Button, Form, Input, Space, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateGroupOpeningPlan() {

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState(false);

    const onFinish = (values) => {
        console.log('data:', values);
    };

    
    const handleFieldChange = () => {
        const nameField = form.getFieldValue("courseName");
        const semesterField = form.getFieldValue("semester"); 
        setSubmittable(!!nameField && !!semesterField); 
    };

    const courses = [
        { value: 'lap_trinh_c', label: 'Lập trình C' },
        { value: 'co_so_du_lieu', label: 'Cơ sở dữ liệu' },
        { value: 'kinh_te_vi_mo', label: 'Kinh tế vĩ mô' },
        { value: 'quan_tri_doanh_nghiep', label: 'Quản trị doanh nghiệp' },
        { value: 'mang_may_tinh', label: 'Mạng máy tính' },
    ];

    const semester = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
    ];

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
                    >
                        <div className="flex space-x-6 justify-between w-full">
                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="courseName"
                                label="Tên học phần"
                                rules={[{ required: true, message: 'Tên học phần là bắt buộc!' }]}
                            >
                                <Select
                                    placeholder="Chọn học phần"
                                    onChange={handleFieldChange}
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
                                name="semester"
                                label="Học kỳ"
                                rules={[{ required: true, message: 'Học kỳ là bắt buộc!' }]}
                            >
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
                                name="NumberOfGroups"
                                label="Số lượng Nhóm"
                                rules={[{ required: true, message: 'Số lượng Nhóm là bắt buộc!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={10}
                                    defaultValue={1}
                                    className="border rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: '20px', width: '48%' }}
                                name="NumberOfStudents"
                                label="Số Sinh Viên"
                                rules={[{ required: true, message: 'Số Sinh Viên là bắt buộc!' }]}
                            >
                                <InputNumber
                                    min={30}
                                    max={1000}
                                    defaultValue={30}
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
    )
}

export default CreateGroupOpeningPlan;
