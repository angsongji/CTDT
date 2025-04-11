import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Row, Col } from 'antd';
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";

function Course() {
	const [dataCourse, setDataCourse] = useState([
		{
			key: '1',
			id: '841302',
			name: 'Cơ sở lập trình',
			credits: 4,
			lectureHours: 45,
			practiceHours: 30,
			internshipHours: 0,
			weightingFactor: 0.8,
			require: true,
			status: 1,
			id_KnowledgeAreas: "II",
			name_KnowledgeAreas: "Chuyên nghiệp",
		},
		{
			key: '2',
			id: '861301',
			name: 'Triết học Mác – Lênin',
			credits: 3,
			lectureHours: 45,
			practiceHours: 0,
			internshipHours: 0,
			weightingFactor: 1,
			require: true,
			status: 1,
			id_KnowledgeAreas: "I",
			name_KnowledgeAreas: "Giáo dục đại cương",
		},
	]);

	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('add');
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	const columns = [
		{ title: 'Mã HP', dataIndex: 'id', key: 'id' },
		{ title: 'Tên HP', dataIndex: 'name', key: 'name' },
		{ title: 'STC', dataIndex: 'credits', key: 'credits' },
		{ title: 'Lý thuyết', dataIndex: 'lectureHours', key: 'lectureHours' },
		{ title: 'Thực hành', dataIndex: 'practiceHours', key: 'practiceHours' },
		{ title: 'Thực tập', dataIndex: 'internshipHours', key: 'internshipHours' },
		{ title: 'Hệ số học phần', dataIndex: 'weightingFactor', key: 'weightingFactor' },
		{ title: 'Khối kiến thức', dataIndex: 'name_KnowledgeAreas', key: 'name_KnowledgeAreas' },
		{
			title: 'Loại HP',
			dataIndex: 'require',
			key: 'require',
			render: (require) => (require ? 'Bắt buộc' : 'Tự chọn'),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<div className="flex gap-2">
					<Button icon={<MdModeEdit />} onClick={() => handleEdit(record)}>Sửa</Button>
					<Button danger icon={<MdDelete />} onClick={() => showModalDelete(record)}>Xoá</Button>
				</div>
			),
		},
	];

	const handleAdd = () => {
		setMode('add');
		setSelectedRecord(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (record) => {
		setMode('edit');
		setSelectedRecord(record);
		form.setFieldsValue(record);
		setModalVisible(true);
	};

	const handleSave = (values) => {
		if (mode === 'add') {
			const newCourse = {
				...values,
				key: Date.now().toString(),
				status: 1,
			};
			setDataCourse(prev => [...prev, newCourse]);
			message.success('Thêm học phần thành công!');
		} else if (mode === 'edit') {
			const updated = dataCourse.map(item =>
				item.key === selectedRecord.key ? { ...item, ...values } : item
			);
			setDataCourse(updated);
			message.success('Cập nhật học phần thành công!');
		}
		setModalVisible(false);
	};

	const showModalDelete = (record) => {
		setSelectedRecord(record);
		setDeleteModalVisible(true);
	};

	const handleDelete = () => {
		setConfirmLoading(true);
		setTimeout(() => {
			setDataCourse(prev => prev.filter(course => course.key !== selectedRecord.key));
			setDeleteModalVisible(false);
			setConfirmLoading(false);
			setSelectedRecord(null);
			message.success('Đã xoá học phần!');
		}, 800);
	};

	return (
		<>
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Khóa học</h1>
				<div className="text-right mb-4">
					<Button
						className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'
						onClick={handleAdd}
					>
						<span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
							<FaPlus />Thêm học phần
						</span>
					</Button>
				</div>
				<Table dataSource={dataCourse} columns={columns} rowKey="key" />
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

					<Form.Item
						label="Khối kiến thức"
						name="name_KnowledgeAreas"
						style={{ marginBottom: '8px' }}
						rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức'}]}>
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
