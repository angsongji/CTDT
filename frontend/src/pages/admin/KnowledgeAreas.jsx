import { Table, Button } from 'antd';
import { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FaPlus } from "react-icons/fa6";
const columns = [
    {
        title: '',
        dataIndex: '',
        key: '',
    },
    {
        title: 'Mã khối',
        dataIndex: 'Id',
        key: 'Id',
    },
    {
        title: 'Tên khối kiến thức',
        dataIndex: 'Name',
        key: 'Name',
    },
    {
        title: 'Tính vào tín chỉ tích lũy',
        dataIndex: 'Use',
        key: 'Use',
        align: 'center', // Căn giữa cột
        render: (use) =>
            use === 1 ? (
                <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
            ) : (
                <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
            ),
    },
];

const list_knowledge_areas = [
    { Id: 1, Name: "Khối kiến thức giáo dục đại cương.", Id_Parent: 0, Use: 1 },
    { Id: 2, Name: "Kiến thức Giáo dục thể chất và Giáo dục quốc phòng và an ninh.", Id_Parent: 1, Use: 0 },
    { Id: 3, Name: "Khối kiến thức giáo dục chuyên nghiệp.", Id_Parent: 0, Use: 1 }
];

const data = list_knowledge_areas
    .filter(item => item.Id_Parent === 0)
    .map(parent => ({
        ...parent,
        children: list_knowledge_areas.filter(child => child.Id_Parent === parent.Id)
    }));

function KnowledgeAreas() {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleExpand = (expanded, record) => {
        setExpandedRowKeys(expanded ? [record.Id] : []);
    };

    const TableData = () => (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            scrollToFirstRowOnChange={true}
            expandable={{
                expandedRowKeys,
                onExpand: handleExpand,
                rowExpandable: record => record.children && record.children.length > 0,
            }}
            rowKey="Id"
        />
    )
    return (
        <div className='flex flex-col gap-5 mt-10'>
            {/* Hiện tìm kiếm vào các nút thao tác */}
            <div className='flex justify-end'>
                <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'><span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'><FaPlus />Thêm khối</span></Button>
            </div>
            <TableData />
        </div>
        
    );
}

export default KnowledgeAreas;
