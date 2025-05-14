import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Row, Col } from 'antd';
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../../services/courseServices";

function Course() {
	const [originalDataCourse, setOriginalDataCourse] = useState([]); //Lưu bản gốc
	const [dataCourse, setDataCourse] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('add');
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [form] = Form.useForm();

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const response = await getAllCourses();
			console.log("response", response);

			const formattedCourses = response.map(course => {

				return {
					...course,
					key: course.id,
					require: course.requirement === 1,
					id_KnowledgeAreas: course.knowledgeArea?.id,
					name_KnowledgeAreas: course.knowledgeArea?.name || '-',
					parent_id: course.parent?.id
				};
			});

			setDataCourse(formattedCourses);
			setOriginalDataCourse(formattedCourses); // lưu mảng gốc
		} catch (error) {
			message.error('Không thể tải danh sách học phần!');
			console.error('Error fetching courses:', error);
		} finally {
			setLoading(false);
		}
	};

	const columns = [
		{
			title: 'Mã HP',
			dataIndex: 'id',
			key: 'id',
			render: (id) => id
		},
		{ title: 'Tên HP', dataIndex: 'name', key: 'name' },
		{ title: 'STC', dataIndex: 'credits', key: 'credits' },
		{ title: 'Lý thuyết', dataIndex: 'lectureHours', key: 'lectureHours' },
		{ title: 'Thực hành', dataIndex: 'practiceHours', key: 'practiceHours' },
		{ title: 'Thực tập', dataIndex: 'internshipHours', key: 'internshipHours' },
		{ title: 'Hệ số học phần', dataIndex: 'weightingFactor', key: 'weightingFactor' },
		{
			title: 'Khối kiến thức',
			dataIndex: 'name_KnowledgeAreas',
			key: 'name_KnowledgeAreas',
			render: (text) => text || '-'
		},
		{
			title: 'Loại HP',
			dataIndex: 'require',
			key: 'require',
			render: (require) => (require ? 'Bắt buộc' : 'Tự chọn'),
		},
		{ title: 'Mã HP trước', dataIndex: 'parent_id', key: 'parent_id' },
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<div className="flex gap-2" key={`actions-${record.id}`}>
					<Button
						key={`edit-${record.id}`}
						icon={<MdModeEdit />}
						onClick={() => handleEdit(record)}
					>
						Sửa
					</Button>
					<Button
						key={`delete-${record.id}`}
						danger
						icon={<MdDelete />}
						onClick={() => showModalDelete(record)}
					>
						Xoá
					</Button>
				</div>
			),
		},
	];

	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase();
		if (!value) {
			setDataCourse(originalDataCourse);
		} else {
			const filtered = originalDataCourse.filter((course) => {
				const nameMatch = course.name.toLowerCase().includes(value);
				const idMatch = course.id.toString().includes(value); // id là số, nên cần .toString()
				return nameMatch || idMatch;
			});
			setDataCourse(filtered);
		}
	};

	const handleAdd = () => {
		setMode('add');
		setSelectedRecord(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (record) => {
		//		console.log("record", record);
		setMode('edit');
		setSelectedRecord(record);
		form.setFieldsValue(record);
		setModalVisible(true);
	};

	const handleSave = async (values) => {
		try {
			//			console.log("values", values);
			setLoading(true);
			if (mode === 'add') {
				// Chuẩn bị dữ liệu để gửi lên server
				const newCourse = {
					...values,
					status: 1,
					requirement: values.require ? 1 : 0,
					knowledgeAreas: {
						id: values.id_KnowledgeAreas
					},
					parent: values.parent_id ? {
						id: values.parent_id
					} : null
				};

				// Gọi API tạo mới
				await createCourse(newCourse);
				message.success('Thêm học phần thành công!');
			} else if (mode === 'edit') {

				const updatedCourse = {
					name: values.name,
					credits: values.credits,
					lectureHours: values.lectureHours,
					practiceHours: values.practiceHours,
					internshipHours: values.internshipHours,
					weightingFactor: values.weightingFactor,
					requirement: values.require ? 1 : 0,
					status: selectedRecord.status,
					knowledgeAreas: { id: values.id_KnowledgeAreas || selectedRecord.id_KnowledgeAreas },
					parent: selectedRecord.parent_id ? { id: selectedRecord.parent_id } : null
				};

				// Gọi API cập nhật
				await updateCourse(selectedRecord.id, updatedCourse);
				message.success('Cập nhật học phần thành công!');
			}
			setModalVisible(false);
			// Tải lại dữ liệu sau khi thêm/sửa
			await fetchCourses();
		} catch (error) {
			console.error('Lỗi khi lưu học phần:', error);
			message.error(mode === 'add' ? 'Thêm học phần thất bại!' : 'Cập nhật học phần thất bại!');
		} finally {
			setLoading(false);
		}
	};

	const showModalDelete = (record) => {
		setSelectedRecord(record);
		setDeleteModalVisible(true);
	};

	const handleDelete = async () => {
		try {
			setConfirmLoading(true);

			// Gọi API cập nhật
			await deleteCourse(selectedRecord.id);
			message.success('Đã xoá học phần!');
			setDeleteModalVisible(false);

			// Tải lại dữ liệu sau khi xoá
			await fetchCourses();
		} catch (error) {
			console.error('Lỗi khi xóa học phần:', error);
			message.error('Xóa học phần thất bại!');
		} finally {
			setConfirmLoading(false);
			setSelectedRecord(null);
		}
	};

	return (
		<>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Khóa học</h1>

				<Row justify="space-between" align="middle" className="mb-4">
					<Col className="mr-5">
						<Input
							placeholder="Tìm kiếm học phần"
							onChange={handleSearch}
							allowClear
							style={{ width: 300 }}
						/>
					</Col>
					<Col>
						<Button
							className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'
							onClick={handleAdd}
						>
							<span className='text-white px-2 py-1 rounded-md flex items-center justify-center gap-1'>
								<FaPlus /> Thêm học phần
							</span>
						</Button>
					</Col>
				</Row>

				<Table
					dataSource={dataCourse}
					columns={columns}
					rowKey={(record) => record.id}
					loading={loading}
				/>
			</div>

			<Modal
				title={mode === 'add' ? 'Thêm học phần' : 'Chỉnh sửa học phần'}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				okText={mode === 'add' ? 'Thêm' : 'Lưu'}
				cancelText="Huỷ"
				onOk={() => {
					form
						.validateFields()
						.then((values) => {
							handleSave(values);
							form.resetFields();
						})
						.catch((err) => {
							console.log('Lỗi validate:', err);
						});
				}}
			>
				<Form form={form} layout="vertical"
					initialValues={{
						lectureHours: 0,
						practiceHours: 0,
						internshipHours: 0,
						weightingFactor: 0,
					}}>
					<Form.Item
						label="Mã học phần"
						name="id"
						style={{ marginBottom: '8px' }}
						rules={[{ required: true, message: 'Vui lòng nhập mã học phần' }]}
					>
						<Input disabled={mode === 'edit'} />
					</Form.Item>

					<Form.Item
						label="Tên học phần"
						name="name"
						style={{ marginBottom: '8px' }}
						rules={[{ required: true, message: 'Vui lòng nhập tên học phần' }]}
					>
						<Input />
					</Form.Item>

					{/* Gộp tín chỉ và hệ số HP */}
					<Row gutter={[32, 12]}>
						<Col span={12}>
							<Form.Item
								label="Số tín chỉ"
								name="credits"
								style={{ marginBottom: '8px' }}
								rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
							>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Hệ số HP" name="weightingFactor" style={{ marginBottom: '8px' }}>
								<InputNumber style={{ width: '100%' }} min={0} step={0.1} />
							</Form.Item>
						</Col>
					</Row>

					{/* Gộp LT / TH / TT */}
					<Row gutter={[32, 12]}>
						<Col span={8}>
							<Form.Item label="LT" name="lectureHours" style={{ marginBottom: '8px' }}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="TH" name="practiceHours" style={{ marginBottom: '8px' }}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="TT" name="internshipHours" style={{ marginBottom: '8px' }}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name="id_KnowledgeAreas" hidden>
						<Input />
					</Form.Item>


					<Form.Item
						label="Khối kiến thức"
						name="name_KnowledgeAreas"
						style={{ marginBottom: '8px' }}
						rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						label="Bắt buộc"
						name="require"
						valuePropName="checked"
						style={{ marginBottom: '0' }}
					>
						<Switch checkedChildren="Có" unCheckedChildren="Không" />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Xác nhận xoá"
				open={deleteModalVisible}
				onOk={handleDelete}
				onCancel={() => setDeleteModalVisible(false)}
				confirmLoading={confirmLoading}
				okText="Xoá"
				cancelText="Huỷ"
			>
				<p>Bạn có chắc chắn muốn xoá học phần này?</p>
			</Modal>
		</>
	);
}

export default Course;
