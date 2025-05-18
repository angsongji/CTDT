import { Button, Form, Input, Space, DatePicker, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createTraningCycle } from "../../services/trainingCycleServices";
import { getAllFaculties } from "../../services/facultyServices";
import { createTraningCycleFaculty } from "../../services/trainingCycleFacultyServices";

const { RangePicker } = DatePicker;

function CreateTrainingCycle() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
	const [majors, setMajors] = useState([]);
	
	useEffect(() => {
		const fetchApi = async () => {
			try {
				const result = await getAllFaculties();
				const dataNew = result.data.map(item => ({
					...item,
					label: item.name,
					value: item.id
				}));
				setMajors(dataNew);
			} catch (error) {
				console.error("Lỗi khi lấy danh sách ngành:", error);
			}
		};
		fetchApi();
	}, []);
	

	const onFinish = async (values) => {
	    const data = {
	        name: values.name,
	        startYear: values.dates[0].year(),
	        endYear: values.dates[1].year(),
	    };

	    try {
	        // 1. Tạo chương trình đào tạo
	        const result = await createTraningCycle(data);

	        if (result && result.id) {
	            const trainingCycleId = result.id;
	            const selectedMajors = values.majors || [];

	            // 2. Gọi API tạo trainingCycleFaculty cho từng ngành được chọn
	            await Promise.all(
	                selectedMajors.map(facultyId =>
	                    createTraningCycleFaculty({
	                        trainingCycle: { id: trainingCycleId },
	                        faculty: { id: facultyId }
	                    })
	                )
	            );

	            Swal.fire({
	                title: "Tạo thành công!",
	                text: "Chu kỳ đào tạo mới và danh sách ngành đã được thêm.",
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
	            text: "Đã xảy ra lỗi khi tạo chu kỳ đào tạo hoặc thêm ngành.",
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

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const startYear = dates[0].year();
            const endYear = dates[1].year();
            const name = `Chu kỳ đào tạo ${startYear}-${endYear}`;
            form.setFieldsValue({ name });
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Thêm mới chu kỳ đào tạo</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <Form
                    form={form}
                    name="createTrainingCycle"
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Tên chương trình"
                        rules={[{ required: true, message: 'Tên chương trình là bắt buộc!' }]}
                        
                    >
                        <Input disabled placeholder="Tên chương trình được tạo tự động sau khi chọn khoảng thời gian" />
                    </Form.Item>

                    <Form.Item
                        name="dates"
                        label="Khoảng thời gian"
                        rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
                    >
                        <RangePicker picker="year" style={{ width: '100%' }} onChange={handleDateChange} />
                    </Form.Item>

                    <Form.Item
                        name="majors"
                        label="Danh sách ngành mở (tùy chọn)"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Chọn ngành (không bắt buộc)"
                            options={majors}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space className="flex justify-end w-full">
                            <Button onClick={() => navigate(-1)}>Quay lại</Button>
                            <SubmitButton form={form}>Tạo mới</SubmitButton>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default CreateTrainingCycle;