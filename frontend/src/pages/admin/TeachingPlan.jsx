import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Row, Col, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { MdDelete } from "react-icons/md";
import { updateTeachingPlan, getByInformationId, createTeachingPlan, deleteTeachingPlan } from '../../services/teachingPlanServices';
import { getAllCourses } from "../../services/courseServices";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { FaPlus } from "react-icons/fa6";
function TeachingPlan() {
	const [dataCourse, setDataCourse] = useState([]); // Các học phần đã có trong teaching plan
	const [allCourses, setAllCourses] = useState([]); // Toàn bộ học phần từ API
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState(null);

	const [selectedSemester, setSelectedSemester] = useState(null);
	const [selectedTrainingCycleId, setSelectedTrainingCycleId] = useState(null);
	const [selectedFacultyId, setSelectedFacultyId] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [filteredSubjects, setFilteredSubjects] = useState([]);
	const [maxSemester, setMaxSemester] = useState(8); // Số học kỳ tối đa, mặc định là 8

	const [form] = Form.useForm();
	const [trainingCycles, setTrainingCycles] = useState([]); //Chu kỳ đào tạo
	const [generalInfoId, setGeneralInfoId] = useState(null);


	useEffect(() => {
		fetchTrainingCycles();
	}, []);

	useEffect(() => {
		if (!selectedTrainingCycleId || !selectedFacultyId || trainingCycles.length === 0) return;

		const selectedCycle = trainingCycles.find(tc => tc.id === selectedTrainingCycleId);
		const selectedFaculty = selectedCycle?.faculties.find(f => f.id === selectedFacultyId);

		const trainingCycleFaculty = selectedFaculty?.trainingCycleFacultyList?.find(
			tcf => tcf.trainingCycleId === selectedTrainingCycleId
		);

		const generalInfoId = trainingCycleFaculty?.generalInformation?.id;
		const max = trainingCycleFaculty?.generalInformation?.duration * 2;
		setMaxSemester(max);
		setGeneralInfoId(generalInfoId);

		if (generalInfoId) {
			fetchData([generalInfoId]);
		} else {
			fetchData([]);
		}
	}, [selectedTrainingCycleId, selectedFacultyId]);

	const fetchTrainingCycles = async () => {
		const result = await getAllTraningCycle();
		setTrainingCycles(result);
	}

	const fetchData = async (idInformation = []) => {
		if (!idInformation || idInformation.length === 0) {
			setDataCourse([]);
			return;
		}
		try {
			const response = await getByInformationId(idInformation);
			console.log("response: ", response);

			if (Array.isArray(response)) {
				const formattedData = response.map((item, index) => {

					return {
						key: item.id,
						index: index + 1,
						id_information: item.generalInformation?.id,
						id_course: item.course?.id,
						course_name: item.course?.name,
						implementationSemester: item.implementationSemester,
						id_parent: item.course?.parent?.id,
						status: item.status,
						id_KnowledgeAreas: item.course?.knowledgeArea?.id,
						name_KnowledgeAreas: item.course?.knowledgeArea?.name || '-',
						require: item.course?.requirement,
						credits: item.course?.credits,
						groupOpeningPlans: item.course?.groupOpeningPlans || [],
					};
				});
				const grouped = {};

				formattedData.forEach(item => {
					const key = item.id_course;
					if (!grouped[key]) {
						grouped[key] = {
							...item,
							implementationSemesters: [item.implementationSemester],
							id_teachingPlans: [item.key], // lưu ID tương ứng học kỳ đầu tiên
						};
					} else {
						grouped[key].implementationSemesters.push(item.implementationSemester);
						grouped[key].id_teachingPlans.push(item.key); // thêm ID học kỳ tiếp theo
					}
				});

				const mergedCourses = Object.values(grouped);
				setDataCourse(mergedCourses);
				setFilteredSubjects(mergedCourses);
			} else {
				console.error('Invalid response format:', response);
				setDataCourse([]);
			}
		} catch (error) {
			console.error('Lỗi khi lấy dữ liệu:', error);
			setDataCourse([]);
		}
	};

	//tìm kiếm học phần
	useEffect(() => {
		handleFilter();
	}, [searchText, selectedSemester, dataCourse]);


	const handleFilter = () => {
		let filtered = [...dataCourse];

		// Lọc theo tên hoặc mã học phần
		if (searchText) {
			const lowerText = searchText.toLowerCase();
			filtered = filtered.filter(item =>
				item.course_name?.toLowerCase().includes(lowerText) ||
				item.id_course?.toString().toLowerCase().includes(lowerText)
			);
		}

		// Lọc theo học kỳ thực hiện
		if (selectedSemester) {
			filtered = filtered.filter(item =>
				item.implementationSemesters?.includes(selectedSemester)
			);
		}

		setFilteredSubjects(filtered);
	};


	// Lấy toàn bộ học phần từ API
	useEffect(() => {
		async function fetchAllCourses() {
			// Giả sử bạn có API getAllCourses()
			const res = await getAllCourses();
			setAllCourses(res);
		}

		fetchAllCourses();
	}, []);

	// // Lọc học phần chưa có trong kế hoạch giảng dạy
	// const availableCourses = allCourses.filter(course =>
	// 	!dataCourse.some(dc => dc.id_course === course.id)
	// );

	const handleAdd = () => {
		console.log("selectedTrainingCycleId: ", selectedTrainingCycleId);
		if (!selectedFacultyId || !selectedTrainingCycleId) {
			Modal.warning({
				title: 'Thiếu thông tin',
				content: 'Vui lòng chọn đầy đủ Chu kỳ đào tạo và Ngành học trước khi thêm.',
			});
			return;
		}

		setSelectedCourse(null);
		form.resetFields();            // Reset toàn bộ các trường
		setIsModalVisible(true);       // Mở modal
	};

	const handleEdit = (record) => {
		console.log("record: ", record);
		setSelectedCourse(record);
		form.setFieldsValue({
			...record,
			implementationSemesters: record.implementationSemesters,
		});

		setIsModalVisible(true);
	};


	const handleOk = async () => {
		try {
			await form.validateFields();
			const values = form.getFieldsValue();

			const implementationSemesters = values.implementationSemesters;

			if (selectedCourse) {
				const oldSemesters = selectedCourse.implementationSemesters;
				const oldPlans = selectedCourse.id_teachingPlans;

				const oldLength = oldSemesters.length;
				const newLength = implementationSemesters.length;

				// === Cập nhật các học kỳ tương ứng ===
				const updateCount = Math.min(oldLength, newLength);
				for (let i = 0; i < updateCount; i++) {
					const idPlan = oldPlans[i];
					const updatedSemester = implementationSemesters[i];

					const updatedData = {
						generalInformation: { id: selectedCourse.id_information },
						course: { id: selectedCourse.id_course },
						implementationSemester: updatedSemester,
						status: selectedCourse.status,
					};

					await updateTeachingPlan(idPlan, updatedData);
				}

				// === Xóa học kỳ nếu ít hơn trước ===
				if (newLength < oldLength) {
					for (let i = newLength; i < oldLength; i++) {
						await deleteTeachingPlan(oldPlans[i]);
					}
				}

				// === Thêm học kỳ mới nếu nhiều hơn trước ===
				if (newLength > oldLength) {
					for (let i = oldLength; i < newLength; i++) {
						const newSemester = implementationSemesters[i];

						const newData = {
							generalInformation: { id: selectedCourse.id_information },
							course: { id: selectedCourse.id_course },
							implementationSemester: newSemester,
							status: 1,
						};

						await createTeachingPlan(newData);
					}
				}

				message.success("Đã cập nhật kế hoạch dạy học!");
			} else {
				// === Thêm mới học phần ===
				const isDuplicate = dataCourse.some(dc =>
					dc.id_course === values.id_course &&
					dc.implementationSemesters.some(sem => implementationSemesters.includes(sem))
				);

				if (isDuplicate) {
					message.warning("Học phần đã tồn tại ở ít nhất một học kỳ đã chọn!");
					return;
				}

				for (const semester of implementationSemesters) {
					const newData = {
						generalInformation: { id: generalInfoId },
						course: { id: values.id_course },
						implementationSemester: semester,
						status: 1,
					};
					await createTeachingPlan(newData);
				}

				message.success("Đã thêm học phần vào kế hoạch dạy học!");
			}

			await fetchData([selectedCourse?.id_information || generalInfoId]);
			setIsModalVisible(false);
			form.resetFields();
			setSelectedCourse(null);
		} catch (err) {
			console.error("Lỗi khi xử lý OK:", err);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSelectedCourse(null);
		setSelectedSemester(null);
	};

	const columns = [
		{
			title: 'TT',
			dataIndex: 'index',
			key: 'index',
			width: 60,
			render: (text) => text
		},
		{
			title: 'Mã HP',
			dataIndex: 'id_course',
			key: 'id_course',
			width: 100,
		},
		{
			title: 'Tên HP',
			dataIndex: 'course_name',
			key: 'course_name',
			width: 300,
		},
		{
			title: 'STC',
			dataIndex: 'credits',
			key: 'credits',
			width: 80,
		},
		{
			title: 'Học kỳ thực hiện',
			children: Array.from({ length: maxSemester - 1 }, (_, i) => ({
				title: `${i + 1}`,
				dataIndex: 'implementationSemester',
				key: `semester_${i + 1}`,
				width: 50,
				render: (_, record) => record.implementationSemesters.includes(i + 1) ? 'X' : '',
			})),
		},
		{
			title: 'Mã HP trước',
			dataIndex: 'id_parent',
			key: 'id_parent',
			width: 100,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 100,
			render: (_, record) => {
				const isDeletable = !(record.groupOpeningPlans && record.groupOpeningPlans.length > 0);

				return (
					<div className="flex gap-2" key={`actions-${record.id}`}>
						<Button
							type="primary"
							icon={<EditOutlined />}
							onClick={() => handleEdit(record)}
							title="Chỉnh sửa"
						/>
						<Button
							danger
							type="primary"
							icon={<MdDelete />}
							title={isDeletable ? "Xóa" : "Không thể xóa vì đã mở lớp"}
							onClick={() => {
								if (!isDeletable) {
									message.warning("Không thể xóa học phần vì đã có lớp mở!");
									return;
								}
								Modal.confirm({
									title: 'Xóa học phần',
									content: 'Bạn có chắc chắn muốn xóa học phần này?',
									onOk: async () => {
										try {
											for (const id of record.id_teachingPlans) {
												await deleteTeachingPlan(id);
											}
											message.success('Đã xoá học phần khỏi kế hoạch dạy học!');
											await fetchData([record.id_information]);
										} catch (error) {
											console.error('Lỗi khi xoá:', error);
											message.error('Xoá thất bại một phần hoặc toàn bộ!');
										}
									},
								});
							}}
						/>
					</div>
				);
			}
		}
	];

	return (
		<div className="p-6">
			<Form form={form} layout="inline">
				<Row justify="start" align="middle" gutter={16} className="mb-4" wrap>
					{/* Tìm kiếm học phần */}
					<Col>
						<Input
							placeholder="Tìm kiếm học phần"
							allowClear
							style={{ width: 250 }}
							value={searchText}
							onChange={(e) => {
								setSearchText(e.target.value);
							}}
						/>
					</Col>

					{/* Chọn chu kỳ đào tạo */}
					<Col>
						<Select
							placeholder="Chọn chu kỳ đào tạo"
							style={{ width: 200 }}
							value={selectedTrainingCycleId}
							onChange={(value) => {
								setSelectedTrainingCycleId(value);
								setSelectedFacultyId(undefined);
								setSelectedSemester(undefined);
							}}
							options={trainingCycles.map((area) => ({
								label: `${area.id} - ${area.name}`,
								value: area.id
							}))}
							showSearch
							optionFilterProp="label"
						/>
					</Col>

					{/* Chọn ngành học */}
					<Col>
						<Select
							placeholder="Chọn ngành học"
							style={{ width: 200 }}
							value={selectedFacultyId}
							onChange={(value) => {
								setSelectedFacultyId(value);
								setSelectedSemester(undefined);
							}}
							disabled={!selectedTrainingCycleId}
							options={
								trainingCycles
									.find((tc) => tc.id === selectedTrainingCycleId)
									?.faculties.map((f) => ({
										label: f.name,
										value: f.id
									})) || []
							}
						/>
					</Col>

					{/* Chọn học kỳ thực hiện */}
					<Col>
						<Select
							placeholder="Chọn học kỳ thực hiện"
							style={{ width: 200 }}
							value={selectedSemester}
							onChange={setSelectedSemester}
							disabled={!selectedFacultyId}
							allowClear
							options={
								(() => {
									return Array.from({ length: maxSemester }, (_, i) => ({
										label: `Học kỳ ${i + 1}`,
										value: i + 1
									}));
								})()
							}
						/>
					</Col>

					{/* Nút thêm học phần */}
					<Col>
						<Button
							type='primary'
							className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'
							onClick={handleAdd}
						>
							<span className='text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
								<FaPlus /> Thêm học phần
							</span>
						</Button>
					</Col>
				</Row>
			</Form>

			<div className="bg-white rounded-lg shadow p-6">
				<Table
					columns={columns}
					dataSource={filteredSubjects}
					bordered
					pagination={false}
					rowKey="key"
				/>


				<Modal
					title={selectedCourse ? 'Chỉnh sửa học phần' : 'Thêm học phần'}
					open={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
					okText="Lưu"
					cancelText="Hủy"
				>
					<Form form={form} layout="vertical">
						{/* Nếu là thêm mới thì hiển thị thêm các trường chọn học phần */}
						{!selectedCourse && (
							<>
								<Form.Item
									label="Học phần"
									name="id_course"
									rules={[{ required: true, message: 'Vui lòng chọn học phần' }]}
								>
									<Select
										placeholder="Chọn học phần"
										disabled={!!selectedCourse} // Disable khi sửa, chỉ cho phép sửa học kỳ
										options={allCourses.map(c => ({
											label: `${c.id} - ${c.name}`,
											value: c.id
										}))}
										showSearch
										optionFilterProp="label"
									/>
								</Form.Item>
							</>
						)}

						<Form.Item
							label="Học kỳ thực hiện"
							name="implementationSemesters"
							rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 học kỳ!' }]}
						>
							<Select
								mode="multiple"
								placeholder="Chọn học kỳ"
								allowClear
							>
								{Array.from({ length: maxSemester }, (_, i) => (
									<Select.Option key={i} value={i}>
										Học kỳ {i}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</div>
	);
}

export default TeachingPlan; 