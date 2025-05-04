import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, InputNumber, Select, Button, Table, Card, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { editGroupOpenPlan } from "../../services/groupOpeningPlanCycleServices";
import { editGroup } from "../../services/groupServices";


const { Option } = Select;

function EditGroupOpeningPlan() {
  const [groups, setGroups] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu truyền qua từ component cha
  const { groupData } = location.state || {};
  
  console.log("groupData", groupData)

  useEffect(() => {
    if (groupData) {
      form.setFieldsValue({
        id: groupData.id,
        implementationSemester: groupData.implementationSemester,
        numberOfGroups: groupData.numberOfGroups,
        numberOfStudents: groupData.numberOfStudents,
        status: groupData.status,
      });
      setGroups(groupData.groups);
    }
  }, [groupData, form]);

  const handleGroupChange = (value, index) => {
    const newGroups = [...groups];
    newGroups[index].maxStudents = value;
    setGroups(newGroups);
  };


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
  
  const onUpdate = async (values) => {
    const bodyData = {
      numberOfGroups: values.numberOfGroups,
      numberOfStudents: values.numberOfStudents,
      implementationSemester: values.implementationSemester,
      course: {
        id: groupData.course.id,
      },
    };

    try {
      const result = await editGroupOpenPlan(values.id, bodyData);

      if (!result || !result.id) {
        throw new Error("Không nhận được ID GroupOpeningPlan sau khi cập nhật.");
      }

      const groupOpeningPlanId = result.id;


      const groupUpdateRequests = values.groups.map((group) => {
        const groupBody = {
          groupNumber: group.groupNumber,
          maxStudents: group.maxStudents,
          groupOpeningPlan: {
            id: groupOpeningPlanId,
          },
        };

        return editGroup(group.id, groupBody); 
      });

      await Promise.all(groupUpdateRequests);

      Swal.fire({
        title: "Cập nhật thành công!",
        text: "Thông tin nhóm học đã được cập nhật.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        navigate("/admin/group-opening-plan");
      });

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi cập nhật nhóm học.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };



  const handleSubmit = () => {
      const totalMax = groups.reduce((sum, g) => sum + Number(g.maxStudents), 0);
      const totalStudents = form.getFieldValue('numberOfStudents');

      if (totalMax !== totalStudents) {
        message.error('Tổng số lượng tối đa của các nhóm phải bằng Tổng số sinh viên!');
        return;
      }

      const updatedData = {
        ...form.getFieldsValue(),
        groups,
      };

      console.log('Submitted data:', updatedData);
      onUpdate(updatedData);
    };

  return (
    <div style={{ padding: '24px' }}>
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
              <InputNumber min={1} max={9} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="numberOfGroups"
              label="Số lượng nhóm"
              style={{ flex: 1 }}
            >
              <InputNumber disabled style={{ width: "100%" }} />
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

        <h3>Danh sách nhóm</h3>
        <Table
          dataSource={groups}
          columns={columns}
          rowKey="id"
          pagination={false}
        />

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EditGroupOpeningPlan;
