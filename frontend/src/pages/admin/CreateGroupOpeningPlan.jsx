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

    // Monitor field changes to enable/disable the submit button
    const handleFieldChange = () => {
        const nameField = form.getFieldValue("name");
        setSubmittable(!!nameField); // Enable button if the name field is selected
    };

    const courses = [
        { value: 'lap_trinh_c', label: 'Lập trình C' },
        { value: 'co_so_du_lieu', label: 'Cơ sở dữ liệu' },
        { value: 'kinh_te_vi_mo', label: 'Kinh tế vĩ mô' },
        { value: 'quan_tri_doanh_nghiep', label: 'Quản trị doanh nghiệp' },
        { value: 'mang_may_tinh', label: 'Mạng máy tính' },
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

                        <Form.Item
                            style={{ marginBottom: '20px' }}
                            name="name"
                            label="Tên học phần"
                            rules={[{ required: true, message: 'Tên học phần là bắt buộc!' }]}
                        >
                            <Select 
                                placeholder="Chọn học phần" 
                                onChange={handleFieldChange}
                            >
                                {courses.map(course => (
                                    <Select.Option key={course.value} value={course.value}>
                                        {course.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className='flex space-between w-full'>
                            <Form.Item
                                style={{ marginBottom: '20px', width:'50%' }}
                                name="NumberOfGroups"
                                label="Số lượng Nhóm"
                                rules={[{ required: true, message: 'Số lượng Nhóm là bắt buộc!' }]}
                            >
                                <InputNumber min={1} max={10} defaultValue={1} style={{ width: '40%' }} />
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: '20px', width:'50%' }}
                                name="NumberOfStudents"
                                label="Số Sinh Viên"
                                rules={[{ required: true, message: 'Số Sinh Viên là bắt buộc!' }]}
                            >
                                <InputNumber min={30} max={1000} defaultValue={30} style={{ width: '40%' }} />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Space className="flex justify-end w-full">
                                <Button onClick={() => navigate(-1)}>Quay lại</Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    disabled={!submittable}
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
