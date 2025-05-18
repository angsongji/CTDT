import { Descriptions, Tag, Card, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function DetailTrainingCycle() {
    const navigate = useNavigate();
    const location = useLocation();
    const detail = location.state?.record;

    if (!detail) return <p>Không có dữ liệu chi tiết để hiển thị.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Chi tiết chu kỳ đào tạo</h1>

            <Card className="mb-4" bordered={false}>
                <Descriptions column={1} bordered size="middle">
                    <Descriptions.Item label="Tên chương trình">
                        {detail.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Khoảng thời gian">
                        {detail.startYear} - {detail.endYear}
                    </Descriptions.Item>

                    <Descriptions.Item label="Danh sách ngành mở">
                        {(detail.faculties || []).length > 0 ? (
                            detail.faculties.map((fac) => (
                                <Tag color="blue" key={fac.id}>
                                    {fac.name}
                                </Tag>
                            ))
                        ) : (
                            <Tag color="red">Không có ngành</Tag>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <div className="flex justify-end mt-2">
                <Button type="default" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>
        </div>
    );
}

export default DetailTrainingCycle;
