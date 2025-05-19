import { Button, Form, InputNumber, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createGroupOpenPlan } from "../../services/groupOpeningPlanServices";
import { createGroup } from "../../services/groupServices";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { getAll } from "../../services/teachingPlanServices";

function CreateGroupOpeningPlan() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState(false);

    const [trainingCycles, setTrainingCycles] = useState([]);
    const [majors, setMajors] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedCycleId, setSelectedCycleId] = useState(null);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [teachingPlans, setTeachingPlans] = useState([]);
	const [selectedTraningFacultyId, setSelectedTraningFacultyId] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            const cycleData = await getAllTraningCycle();
            const teachingPlanData = await getAll();
            setTrainingCycles(cycleData);
            setTeachingPlans(teachingPlanData);
        };
        fetchData();
    }, []);

    const handleFieldChange = () => {
        const courseField = form.getFieldValue("course_id");
        const semesterField = form.getFieldValue("implementationSemester");
        setSubmittable(!!courseField && !!semesterField);
    };

	const handleCycleChange = (value) => {
	    setSelectedCycleId(value);
	    form.resetFields(["major", "course_id", "implementationSemester"]);
	    
	    const cycle = trainingCycles.find(c => c.id === value);
	    const faculties = cycle?.faculties || [];

	    const majorsList = faculties.flatMap(faculty => 
	        faculty.trainingCycleFacultyList
	            .filter(tcfl => tcfl.trainingCycleId === cycle.id)
	            .map(tcfl => ({
	                value: `${faculty.id}-${tcfl.generalInformation.id}`,
	                label: `${tcfl.generalInformation.name}`,
	                facultyId: faculty.id,
	                majorInfo: tcfl.generalInformation,
					traningFacultyId: tcfl.id
	            }))
	    );
		console.log("majorsList",majorsList);

	    setMajors(majorsList);
	    setCourses([]);
	};

    const handleMajorChange = (value) => {
        setSelectedMajor(value);
		console.log("Major", value);
        form.resetFields(["course_id", "implementationSemester"]);

        const [facultyId, majorId] = value.split("-").map(Number);		
		
		const selectedMajorObj = majors.find(m => m.value === value);
	    if (selectedMajorObj) {
	        setSelectedTraningFacultyId(selectedMajorObj.traningFacultyId);
		}			
		
        const filteredCourses = teachingPlans.filter(tp =>
            tp.generalInformation.id === majorId && 
			tp.course.groupOpeningPlans.length === 0
        ).map(tp => ({
            value: tp.course.id,
            label: tp.course.name,
            semester: tp.implementationSemester
        }));
		
		console.log("teachingPlans",teachingPlans);
		console.log("filteredCourses", filteredCourses);

        setCourses(filteredCourses);
    };

    const handleCourseChange = (value) => {
        const selectedCourse = courses.find(c => c.value === value);
        if (selectedCourse) {
            form.setFieldsValue({
                implementationSemester: selectedCourse.semester
            });
        }
        handleFieldChange();
    };

	const onFinish = async (values) => {

	    const bodyData = {
	        numberOfGroups: values.numberOfGroups,
	        numberOfStudents: values.numberOfStudents,
	        implementationSemester: values.implementationSemester,
	        course: {
	            id: values.course_id,
	        },
			trainingCycleFaculty: {
			        id: selectedTraningFacultyId,
			}
	    };
		console.log(bodyData);

	    try {
	        const result = await createGroupOpenPlan(bodyData);
			console.log("result", result);

	        if (result?.id) {
	            const baseStudentsPerGroup = Math.floor(values.numberOfStudents / values.numberOfGroups);
	            let remainder = values.numberOfStudents % values.numberOfGroups;

	            const groupPromises = Array.from({ length: values.numberOfGroups }, (_, index) => {
	                let studentsInGroup = baseStudentsPerGroup;

	                if (remainder > 0) {
	                    studentsInGroup += 1;
	                    remainder -= 1;
	                }

	                const groupBody = {
	                    groupNumber: index + 1,
	                    maxStudents: studentsInGroup,
	                    groupOpeningPlan: { id: result.id },
	                };

	                return createGroup(groupBody); 
	            });

	            await Promise.all(groupPromises); 

	            Swal.fire('Thành công', 'Tạo kế hoạch mở lớp thành công', 'success');
	            navigate(-1);
	        }
	    } catch (error) {
	        Swal.fire('Lỗi', 'Có lỗi xảy ra khi tạo kế hoạch mở lớp', 'error');
	    }
	};


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tạo kế hoạch mở lớp</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFieldsChange={handleFieldChange}
                >
                    <div className="flex space-x-6 justify-between w-full">
                        <Form.Item
                            name="trainingCycle"
                            label="Chương trình đào tạo"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Vui lòng chọn chương trình' }]}
                        >
                            <Select onChange={handleCycleChange} placeholder="Chọn chương trình">
                                {trainingCycles.map(cycle => (
                                    <Select.Option key={cycle.id} value={cycle.id}>
                                        {cycle.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="major"
                            label="Ngành"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
                        >
                            <Select onChange={handleMajorChange} placeholder="Chọn ngành">
                                {majors.map(major => (
                                    <Select.Option key={major.value} value={major.value}>
                                        {major.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="course_id"
                        label="Học phần"
                        rules={[{ required: true, message: 'Vui lòng chọn học phần' }]}
                    >
                        <Select onChange={handleCourseChange} placeholder="Chọn học phần">
                            {courses.map(course => (
                                <Select.Option key={course.value} value={course.value}>
                                    {course.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="flex space-x-6 justify-between w-full">
                        <Form.Item
                            name="implementationSemester"
                            label="Học kỳ"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Vui lòng nhập học kỳ' }]}
                        >
                            <InputNumber min={1} max={12} style={{ width: '100%' }} disabled />
                        </Form.Item>

                        <Form.Item
                            name="numberOfGroups"
                            label="Số nhóm"
                            style={{ width: '48%' }}
                            rules={[{ required: true, message: 'Vui lòng nhập số nhóm' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="numberOfStudents"
                        label="Số sinh viên"
                        rules={[{ required: true, message: 'Vui lòng nhập số sinh viên' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Space className="flex justify-end w-full">
                            <Button onClick={() => navigate(-1)}>Quay lại</Button>
                            <Button type="primary" htmlType="submit" disabled={!submittable}>
                                Tạo mới
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default CreateGroupOpeningPlan;