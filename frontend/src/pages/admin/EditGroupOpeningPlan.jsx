import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  Table,
  message,
  Select,
  Card,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import {
  getGroupOpenPlanById,
  editGroupOpenPlan,
} from "../../services/groupOpeningPlanServices";
import { createGroup, editGroup } from "../../services/groupServices";

const { Option } = Select;

function EditGroupOpeningPlan() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state.record;
  const selectedCycle = location.state.selectedCycle;
  const selectedFaculty = location.state.selectedFaculty;

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (record) {
      getGroupOpenPlanById(record.id).then((res) => {
        form.setFieldsValue(res);
        setGroups(res.groups);
      });
    }
  }, [record, form]);

  const handleGroupCountChange = (value) => {
    const currentCount = groups.length;
    const existingGroups = groups.filter((g) => g.id);

    if (value < existingGroups.length) {
      message.warning(
        `Không thể giảm số lượng nhóm xuống dưới ${existingGroups.length} vì có ${existingGroups.length} nhóm đã tồn tại.`
      );
      form.setFieldValue("numberOfGroups", currentCount);
      return;
    }

    if (value > currentCount) {
      const newGroups = [...groups];
      for (let i = currentCount; i < value; i++) {
        newGroups.push({
          groupNumber: i + 1,
          maxStudents: 0,
        });
      }
      setGroups(newGroups);
    } else if (value < currentCount) {
      Swal.fire({
        title: "Giảm số nhóm?",
        text: `Bạn đang giảm số lượng nhóm từ ${currentCount} xuống ${value}. Các nhóm chưa tồn tại sẽ bị xóa.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Tiếp tục",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const newGroups = groups.slice(0, value);
          setGroups(newGroups);
          form.setFieldValue("numberOfGroups", value);
        } else {
          form.setFieldValue("numberOfGroups", currentCount);
        }
      });
    }
  };

  const handleBackClick = () => {
    navigate("/admin/group-opening-plan", {
      state: { selectedCycle, selectedFaculty },
    });
  };

  const handleSubmit = () => {
    const totalMax = groups.reduce(
      (sum, g) => sum + Number(g.maxStudents || 0),
      0
    );
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

    onUpdate(updatedData);
  };

  const onUpdate = async (values) => {
    const bodyData = {
      numberOfGroups: values.numberOfGroups,
      numberOfStudents: values.numberOfStudents,
      implementationSemester: values.implementationSemester,
      status: values.status,
      course: {
        id: record.idCourse,
      },
    };

    try {
      const result = await editGroupOpenPlan(values.id, bodyData);
      if (!result || !result.id)
        throw new Error("Không nhận được ID GroupOpeningPlan sau khi cập nhật.");

      const groupOpeningPlanId = result.id;

      const groupUpdateRequests = groups.map((group, index) => {
        const groupBody = {
          groupNumber: index + 1,
          maxStudents: group.maxStudents,
          groupOpeningPlan: { id: groupOpeningPlanId },
        };

        if (group.id) {
          return editGroup(group.id, groupBody);
        } else {
          return createGroup(groupBody);
        }
      });

      await Promise.all(groupUpdateRequests);

      Swal.fire({
        title: "Cập nhật thành công!",
        text: "Thông tin nhóm học đã được cập nhật.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/admin/group-opening-plan", {
          state: { selectedCycle, selectedFaculty },
        });
      });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi cập nhật nhóm học.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const columns = [
    {
      title: "Nhóm",
      dataIndex: "groupNumber",
      key: "groupNumber",
      render: (_, __, index) => `Nhóm ${index + 1}`,
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "maxStudents",
      key: "maxStudents",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={groups[index].maxStudents}
          onChange={(value) => {
            const newGroups = [...groups];
            newGroups[index].maxStudents = value;
            setGroups(newGroups);
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
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
              <InputNumber disabled style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="numberOfGroups"
              label="Số lượng nhóm"
              style={{ flex: 1 }}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                onChange={handleGroupCountChange}
              />
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
            <Form.Item name="status" label="Trạng thái" style={{ flex: 1 }}>
              <Select>
                <Option value={1}>Đang mở</Option>
                <Option value={0}>Đã đóng</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>

        <h3>Danh sách nhóm</h3>
        <Table
          dataSource={groups}
          columns={columns}
          rowKey={(record, index) => record.id || `new-${index}`}
          pagination={false}
        />

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Button type="primary" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EditGroupOpeningPlan;
