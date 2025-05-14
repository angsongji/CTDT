import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, InputNumber } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getByCourseId, update, remove } from '../../services/courseOutlineServices';

/**
 * Component hiển thị đề cương chi tiết môn học
 * @returns {JSX.Element} Component CourseOutline
 */
function CourseOutlineDetail() {
	const [dataEvaluation, setDataEvaluation] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams();

	/**
	 * Xây dựng cấu trúc cây từ dữ liệu phẳng
	 * @param {Array} items - Mảng dữ liệu đầu vào
	 * @param {number|null} parentId - ID của node cha
	 * @returns {Array} Cấu trúc cây đã được xây dựng
	 */
	const buildTree = (items, parentId = null) => {
		return items
			.filter(item => parentId === null ? !item.parent : item.parent?.id === parentId)
			.map(item => {
				const prefix = item.assessmentUnit.split('.')[0] + '.' + item.assessmentUnit.split('.')[1];
				const samePrefixItems = items.filter(i =>
					i.assessmentUnit.startsWith(prefix) &&
					i.assessmentUnit !== item.assessmentUnit
				);

				if (samePrefixItems.length > 0) {
					return {
						...item,
						key: item.id,
						children: samePrefixItems.map(child => ({
							...child,
							key: child.id,
							children: buildTree(items, child.id)
						}))
					};
				}

				return {
					...item,
					key: item.id,
					children: buildTree(items, item.id)
				};
			});
	};

	/**
	 * Tính toán rowSpan cho các cột
	 * @param {Array} data - Dữ liệu đầu vào
	 * @returns {Array} Mảng chứa thông tin rowSpan cho mỗi dòng
	 */
	const calculateRowSpan = (data) => {
		const rowSpanMap = new Map();
		const processedKeys = new Set();

		data.forEach(item => {
			const key = item.assessmentUnit;
			rowSpanMap.set(key, (rowSpanMap.get(key) || 0) + 1);
		});

		return data.map(item => {
			const key = item.assessmentUnit;
			if (!processedKeys.has(key)) {
				processedKeys.add(key);
				return { key, rowSpan: rowSpanMap.get(key) };
			}
			return { key, rowSpan: 0 };
		});
	};

	// Tách hàm fetchCourseOutline ra ngoài useEffect
	const fetchCourseOutline = async () => {
		setLoading(true);
		try {
			const data = await getByCourseId(id);
			setDataEvaluation(buildTree(data));
		} catch (error) {
			console.error('Lỗi khi tải đề cương chi tiết:', error);
			message.error('Lỗi khi tải đề cương chi tiết');
		} finally {
			setLoading(false);
		}
	};

	// Tải dữ liệu khi component mount
	useEffect(() => {
		fetchCourseOutline();
	}, [id]);

	// Xử lý sửa đề cương
	const handleEdit = (record) => {
		setSelectedRecord(record);
		form.setFieldsValue({
			assessmentUnit: record.assessmentUnit,
			componentScore: record.componentScore,
			weight: record.weight,
			assessmentMethod: record.assessmentMethod
		});
		setModalVisible(true);
	};

	// Xử lý xóa đề cương
	const handleDelete = async (values) => {
		setLoading(true);
		try {
			const data = {
				assessmentUnit: values.assessmentUnit,
				componentScore: values.componentScore,
				assessmentMethod: values.assessmentMethod,
				weight: parseFloat(values.weight),
				status: 0 
			};

			await update(values.id, data);
			message.success('Xóa đề cương thành công');
			await fetchCourseOutline(); // Tải lại dữ liệu sau khi xóa
		} catch (error) {
			console.error('Lỗi khi xóa đề cương:', error);
			message.error('Xóa đề cương thất bại');
		} finally {
			setLoading(false);
		}
	};

	// Xử lý lưu đề cương
	const handleSave = async (values) => {
		setLoading(true);
		try {
			const data = {
				assessmentUnit: values.assessmentUnit,
				componentScore: values.componentScore,
				assessmentMethod: values.assessmentMethod,
				weight: parseFloat(values.weight),
				status: selectedRecord.status
			};

			await update(selectedRecord.id, data);
			message.success('Cập nhật đề cương thành công');
			setModalVisible(false);
			await fetchCourseOutline(); // Tải lại dữ liệu sau khi cập nhật
		} catch (error) {
			console.error('Lỗi khi cập nhật đề cương:', error);
			message.error('Cập nhật đề cương thất bại');
		} finally {
			setLoading(false);
		}
	};

	// Định nghĩa cấu hình cột cho bảng
	const columns = useMemo(() => [
		{
			title: 'Bộ phận được đánh giá',
			dataIndex: 'assessmentUnit',
			key: 'assessmentUnit',
			width: 200,
			render: (text) => {
				const isMainSection = text && (text === '1. Đánh giá quá trình' || text === '2. Đánh giá cuối kỳ');
				return isMainSection ? <span style={{ fontWeight: 'bold' }}>{text}</span> : text;
			},
			onCell: (record) => {
				const rowSpanArray = calculateRowSpan(dataEvaluation);
				const currentRowSpan = rowSpanArray.find(item => item.key === record.assessmentUnit);
				return { rowSpan: currentRowSpan?.rowSpan || 1 };
			}
		},
		{
			title: 'Điểm đánh giá bộ phận',
			dataIndex: 'componentScore',
			key: 'componentScore',
			width: 300,
			render: (scores) => {
				if (!scores) return null;
				const scoreArray = Array.isArray(scores) ? scores : [scores];
				return (
					<div>
						{scoreArray.map((score, index) => (
							<div key={index} className="relative">
								<div className="py-2">{score}</div>
								{index < scoreArray.length - 1 && (
									<div className="absolute bottom-0 left-0 right-0 border-b border-gray-200" style={{ width: '100vw' }}></div>
								)}
							</div>
						))}
					</div>
				);
			}
		},
		{
			title: 'Trọng số',
			dataIndex: 'weight',
			key: 'weight',
			width: 100,
			render: (text) => text ? `${(text * 100).toFixed(0)}%` : null
		},
		{
			title: 'Hình thức đánh giá',
			dataIndex: 'assessmentMethod',
			key: 'assessmentMethod',
			width: 200,
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_, record) => (
				<div className="flex gap-2">
					<Button
						type="primary"
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
					>
						Sửa
					</Button>
					<Popconfirm
						title="Xóa đề cương"
						description="Bạn có chắc chắn muốn xóa đề cương này?"
						onConfirm={() => handleDelete(record)}
						okText="Có"
						cancelText="Không"
					>
						<Button
							type="primary"
							danger
							icon={<DeleteOutlined />}
						>
							Xóa
						</Button>
					</Popconfirm>
				</div>
			),
		}
	], [dataEvaluation]);

	return (
		<div className="p-6">
			<div className="flex items-center mb-4">
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => navigate('/admin/course-outline')}
					className="mr-4"
				>
					Quay lại
				</Button>
				<h1 className="text-2xl font-bold">Đề cương chi tiết</h1>
			</div>
			<div className="bg-white rounded-lg shadow p-6">
				{dataEvaluation.length === 0 && !loading && (
					<div className="text-center text-gray-500">Không có dữ liệu.</div>
				)}
				<Table
					columns={columns}
					dataSource={dataEvaluation}
					bordered
					pagination={false}
					loading={loading}
					expandable={{
						defaultExpandAllRows: true,
						rowExpandable: record => record.children && record.children.length > 0
					}}
				/>
			</div>

			<Modal
				title="Chỉnh sửa đề cương"
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={() => {
					form
						.validateFields()
						.then((values) => {
							handleSave(values);
						})
						.catch((err) => {
							console.log('Lỗi validate:', err);
						});
				}}
				okText="Lưu"
				cancelText="Hủy"
			>
				<Form form={form} layout="vertical">
					<Form.Item
						label="Bộ phận được đánh giá"
						name="assessmentUnit"
						rules={[{ required: true, message: 'Vui lòng nhập bộ phận được đánh giá' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Điểm đánh giá bộ phận"
						name="componentScore"
						rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá bộ phận' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Trọng số"
						name="weight"
						rules={[{ required: true, message: 'Vui lòng nhập trọng số' }]}
					>
						<InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label="Hình thức đánh giá"
						name="assessmentMethod"
						rules={[{ required: true, message: 'Vui lòng nhập hình thức đánh giá' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default CourseOutlineDetail;
