import { Button, Form, Input, Space, DatePicker, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import moment from 'moment';
import { getAllFaculties } from "../../services/facultyServices";
import { createTraningCycleFaculty, delFacultyTrainingCycle } from "../../services/trainingCycleFacultyServices";
import { patchTraningCycle } from "../../services/trainingCycleServices";

const { RangePicker } = DatePicker;

function EditTrainingCycle() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const record = location.state?.record;

    const [majors, setMajors] = useState([]); 
    const [selectedMajors, setSelectedMajors] = useState([]); 
	
	console.log("record", record);

    useEffect(() => {
        const fetchData = async () => {
            const allFaculties = await getAllFaculties();
			console.log("allFaculties", allFaculties);

            const majorOptions = allFaculties.data.map(fac => ({
                label: fac.name,
                value: fac.id
            }));

            setMajors(majorOptions);

            if (record) {
                const selected = record.faculties?.map(fac => fac.id) || [];
                setSelectedMajors(selected);

                form.setFieldsValue({
                    name: record.name,
                    dates: [
                        moment(`${record.startYear}`, 'YYYY'),
                        moment(`${record.endYear}`, 'YYYY')
                    ],
                    majors: selected
                });
            }
        };

        fetchData();
    }, [record, form]);

	

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
	const onFinish = async (values) => {
	    const payload = {
	        name: values.name,
	        startYear: values.dates[0].year(),
	        endYear: values.dates[1].year(),
	    };

	    const selectedMajors = values.majors || [];

	    try {
	        const result = await patchTraningCycle(record.id, payload);
			console.log("result", result);

	        const oldFacultyIds = record.faculties?.map(fac => fac.id) || [];
	        const added = selectedMajors.filter(id => !oldFacultyIds.includes(id));
	        const removed = oldFacultyIds.filter(id => !selectedMajors.includes(id));
			console.log("added", added);
			console.log("removed", removed);

	        // Xử lý xóa ngành bị gỡ bỏ song song
	        const deletePromises = record.faculties
	            .filter(fac => removed.includes(fac.id))
	            .flatMap(fac => 
	                (fac.trainingCycleFacultyList || []).map(tcf => 
	                    delFacultyTrainingCycle(tcf.id)
	                )
	            );

	        // Xử lý thêm ngành mới song song
	        const createPromises = added.map(facultyId =>
	            createTraningCycleFaculty({
	                trainingCycle: { id: result.id },
	                faculty: { id: facultyId }
	            })
	        );

	        // Đợi tất cả promises chạy song song
	        await Promise.all([...deletePromises, ...createPromises]);

	        Swal.fire({
	            title: "Thành công!",
	            text: "Đã cập nhật chu kỳ đào tạo.",
	            icon: "success",
	            confirmButtonText: "OK"
	        });

	        navigate(-1);

	    } catch (error) {
	        console.error('Lỗi:', error);
	        Swal.fire({
	            title: "Lỗi!",
	            text: "Đã xảy ra lỗi khi cập nhật chu kỳ đào tạo hoặc thêm/xóa ngành.",
	            icon: "error",
	            confirmButtonText: "OK"
	        });
	    }
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
            <h1 className="text-2xl font-bold mb-4">Chỉnh sửa chu kỳ đào tạo</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Tên chương trình"
                        rules={[{ required: true, message: 'Tên chương trình là bắt buộc!' }]}
                    >
                        <Input disabled placeholder={record.name} />
                    </Form.Item>

                    <Form.Item
                        name="dates"
                        label="Khoảng thời gian"
                        rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
                    >
                        <RangePicker picker="year" style={{ width: '100%' }} onChange={handleDateChange}/>
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
                            <SubmitButton form={form}>Cập nhật</SubmitButton>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default EditTrainingCycle;
