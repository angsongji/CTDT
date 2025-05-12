import { Button, Form, Input, Space, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createTraningCycle } from "../../services/trainingCycleServices";

const { RangePicker } = DatePicker;

function CreateTrainingCycle() {

    const navigate = useNavigate();
    const [form] = Form.useForm();

	const onFinish = async (values) => {
	    const data = {
	        name: values.name,
	        startYear: values.dates[0].year(), 
	        endYear: values.dates[1].year()   
	    };
		
		console.log(data);

	    try {
			const result = await createTraningCycle(data);

	        if (result) { 
	            Swal.fire({
	                title: "Tạo thành công!",
	                text: "Chu kỳ đào tạo mới đã được thêm.",
	                icon: "success",
	                confirmButtonText: "OK"
	            }).then(() => {
	                navigate("/admin/training-cycle");
	            });
	        } 
	    } catch (error) {
	        console.error('Lỗi:', error);
	        Swal.fire({
	            title: "Lỗi!",
	            text: "Đã xảy ra lỗi khi tạo chu kỳ đào tạo.",
	            icon: "error",
	            confirmButtonText: "OK"
	        });
	    }
	};


    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = useState(false);
        const values = Form.useWatch([], form);

        useEffect(() => {
            form
                .validateFields({ validateOnly: true })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);

        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Thêm mới chu kỳ đào tạo</h1>
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
                            label="Tên chương trình"
                            rules={[{ required: true, message: 'Tên chương trình là bắt buộc!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="dates"
                            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                picker="year"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space className="flex justify-end w-full">
                                <Button  onClick={() => navigate(-1)}>Quay lại</Button>
                                <SubmitButton form={form}>Tạo mới</SubmitButton>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default CreateTrainingCycle;
