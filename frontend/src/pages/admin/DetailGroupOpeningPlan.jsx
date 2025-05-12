import React, { useEffect, useState } from "react";
import { Descriptions, Table, Card, Spin, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom"; 
import { ArrowLeftOutlined } from "@ant-design/icons"; 

function DetailGroupOpeningPlan() {
  const [loading, setLoading] = useState(true);
  const [groupOpeningPlan, setGroupOpeningPlan] = useState(null);
  const params = useParams();

  const navigate = useNavigate(); 
  
  useEffect(() => {
      const fetchAPI = async () => {
        try {
          const res = await fetch(`http://localhost:8081/api/group-open-plan/detail/${params.id}`);
          const result = await res.json();
          setGroupOpeningPlan(result); 
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAPI();
    }, [params.id]);

  const columns = [
    {
      title: "Mã nhóm",
      dataIndex: "groupNumber",
      key: "groupNumber",
      align: "center",
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "maxStudents",
      key: "maxStudents",
      align: "center",
    },
    {
      title: "Số lượng phân công giảng dạy",
      dataIndex: "teachingAssignments",
      key: "teachingAssignments",
      align: "center",
      render: (teachingAssignments) => teachingAssignments.length,
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
      {/* Back button with an icon */}
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

      <Card title="Chi tiết Kế hoạch mở nhóm học phần" variant={false}>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Mã kế hoạch">{groupOpeningPlan.id}</Descriptions.Item>
          <Descriptions.Item label="Học kỳ triển khai">{groupOpeningPlan.implementationSemester}</Descriptions.Item>
          <Descriptions.Item label="Số lượng nhóm">{groupOpeningPlan.numberOfGroups}</Descriptions.Item>
          <Descriptions.Item label="Tổng số sinh viên">{groupOpeningPlan.numberOfStudents}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {groupOpeningPlan.status === 1 ? "Đang mở" : "Đã đóng"}
          </Descriptions.Item>
        </Descriptions>

        <h3 style={{ marginTop: "24px" }}>Danh sách nhóm</h3>
        <Table
          dataSource={groupOpeningPlan.groups}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
}

export default DetailGroupOpeningPlan;
