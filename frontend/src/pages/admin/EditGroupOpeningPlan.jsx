import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Select,
  Table,
  Card,
  Spin,
  Button,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

function EditGroupOpeningPlan() {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/group-open-plan/detail/${params.id}`
        );
        const result = await res.json();
        form.setFieldsValue({
          id: result.id,
          implementationSemester: result.implementationSemester,
          numberOfGroups: result.numberOfGroups,
          numberOfStudents: result.numberOfStudents,
          status: result.status,
        });
        setGroups(result.groups);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
  }, [params.id, form]);

  const handleGroupChange = (value, index) => {
    const newGroups = [...groups];
    newGroups[index].maxStudents = value;
    setGroups(newGroups);
  };

  const handleSubmit = () => {
    const totalMax = groups.reduce((sum, g) => sum + Number(g.maxStudents), 0);
    const totalStudents = form.getFieldValue("numberOfStudents");

    if (totalMax !== totalStudents) {
      message.error(
        "Tổng số lượng tối đa của các nhóm phải bằng Tổng số sinh viên!"
      );
      return;
    }

    const updatedData = {
      ...form.getFieldsValue(),
      groups,
    };

    console.log("Submitted data:", updatedData);
    // TODO: Gửi dữ liệu lên server tại đây
  };

  const columns = [
    {
      title: "STT Nhóm",
      dataIndex: "groupNumber",
      key: "groupNumber",
      align: "center",
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "maxStudents",
      key: "maxStudents",
      align: "center",
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={record.maxStudents}
          onChange={(value) => handleGroupChange(value, index)}
        />
      ),
    },
  ];

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", marginTop: 100 }} />;
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#FDF1F1" }}>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackClick}
        style={{
          marginBottom: "16px",
          backgroundColor: "#FF8C00",
          borderColor: "#FF8C00",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        Quay lại
      </Button>

      <Card title="Chỉnh sửa Kế hoạch mở nhóm học phần">
	  <Form form={form} layout="vertical">
	    <Form.Item name="id" label="Mã kế hoạch">
	      <InputNumber disabled style={{ width: "100%" }} />
	    </Form.Item>

	    <div style={{ display: "flex", gap: "16px" }}>
	      <Form.Item
	        name="implementationSemester"
	        label="Học kỳ triển khai"
	        style={{ flex: 1 }}
	      >
	        <InputNumber min={1} max={3} style={{ width: "100%" }} />
	      </Form.Item>
	      <Form.Item
	        name="numberOfGroups"
	        label="Số lượng nhóm"
	        style={{ flex: 1 }}
	      >
	        <InputNumber min={1} style={{ width: "100%" }} />
	      </Form.Item>
	    </div>

	    <div style={{ display: "flex", gap: "16px" }}>
	      <Form.Item
	        name="numberOfStudents"
	        label="Tổng số sinh viên"
	        style={{ flex: 1 }}
	      >
	        <InputNumber min={1} style={{ width: "100%" }} />
	      </Form.Item>
	      <Form.Item
	        name="status"
	        label="Trạng thái"
	        style={{ flex: 1 }}
	      >
	        <Select>
	          <Option value={1}>Đang mở</Option>
	          <Option value={0}>Đã đóng</Option>
	        </Select>
	      </Form.Item>
	    </div>
	  </Form>

        <h3 style={{ marginTop: "24px" }}>Danh sách nhóm</h3>
        <Table
          dataSource={groups}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />

		<div style={{ textAlign: "right", marginTop: "20px" }}>
		  <Button
		    type="primary"
		    onClick={handleSubmit}
		    style={{
		      backgroundColor: "#28a745",
		      borderColor: "#28a745",
		    }}
		  >
		    Lưu thay đổi
		  </Button>
		</div>
      </Card>
    </div>
  );
}

export default EditGroupOpeningPlan;
