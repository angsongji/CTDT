import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getAll, updateTeachingPlan } from '../../services/teachingPlanServices';
import { FaPlus } from "react-icons/fa6";
function TeachingPlan() {
	const [dataCourse, setDataCourse] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await getAll();
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
						credits: item.course?.credits
					};
				});
				console.log("formattedData: ", formattedData);
				setDataCourse(formattedData);
			} else {
				console.error('Invalid response format:', response);
				setDataCourse([]);
			}
		} catch (error) {
			console.error('Lỗi khi lấy dữ liệu:', error);
			setDataCourse([]);
		}
	};


	const handleAdd = () => {
		// setMode('add');
		// setSelectedRecord(null);
		// form.resetFields();
		// setModalVisible(true);
	};

	const handleEdit = (record) => {
		setSelectedCourse(record);
		setSelectedSemester(record.implementationSemester);
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		if (selectedCourse && selectedSemester) {
			try {
				const updatedData = {
					generalInformation: { id: selectedCourse.id_information },
					course: { id: selectedCourse.id_course },
					implementationSemester: selectedSemester,
					status: selectedCourse.status
				};

				console.log("id: ", selectedCourse.key);
				console.log("updatedData: ", updatedData);

				await updateTeachingPlan(selectedCourse.key, updatedData);
				await fetchData();
				setIsModalVisible(false);
			} catch (error) {
				console.error('Lỗi khi cập nhật:', error);
			}
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
			children: Array.from({ length: 12 }, (_, i) => ({
				title: `${i + 1}`,
				dataIndex: 'implementationSemester',
				key: `semester_${i + 1}`,
				width: 50,
				render: (text) => text === i + 1 ? 'X' : '',
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
			render: (_, record) => (
				<Button
					type="primary"
					icon={<EditOutlined />}
					onClick={() => handleEdit(record)}
					title="Chỉnh sửa"
				/>
			),
		},
	];

	return (
		<div className="p-6">
			<Row justify="space-between" align="middle" className="mb-4">
				<Col>
					<Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'
						onClick={handleAdd}
					>
						<span className='text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
							<FaPlus /> Thêm học phần
						</span>
					</Button>
				</Col>
			</Row>
			<div className="bg-white rounded-lg shadow p-6">
				<Table
					columns={columns}
					dataSource={dataCourse}
					bordered
					pagination={false}
				/>

				<Modal
					title="Chọn học kỳ thực hiện"
					open={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
				>
					{selectedCourse && (
						<div>
							<p className="mb-4">
								<strong>Môn học:</strong> {selectedCourse.course_name}
							</p>
							<div className="mb-4">
								<label className="block mb-2">Học kỳ thực hiện:</label>
								<Select
									style={{ width: '100%' }}
									value={selectedSemester}
									onChange={setSelectedSemester}
								>
									{Array.from({ length: 12 }, (_, i) => (
										<Select.Option key={i + 1} value={i + 1}>
											Học kỳ {i + 1}
										</Select.Option>
									))}
								</Select>
							</div>
						</div>
					)}
				</Modal>
			</div>
		</div>
	);
}

export default TeachingPlan; 