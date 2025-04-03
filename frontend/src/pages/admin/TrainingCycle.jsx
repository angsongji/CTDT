import React from 'react';
import { FaPlus } from "react-icons/fa6";
import { Input, Button,  Table } from 'antd';


const dataSource = [
  {
    key: '1',
    name: 'Chương trình đạo tạo chu kì 2020-2024',
    startYear: '2020',
    endYear: '2024',

  },
  {
    key: '2',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
  {
    key: '3',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
  {
    key: '4',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
  {
    key: '5',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
  {
    key: '6',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
  {
    key: '7',
    name: 'Chương trình đạo tạo chu kì 2024-2028',
    startYear: '2024',
    endYear: '2028',
  },
];

const columns = [
  {
    title: 'Tên chương trình',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Năm bắt đầu',
    dataIndex: 'startYear',
    key: 'startYear',
  },
  {
    title: 'Năm kết thúc',
    dataIndex: 'endYear',
    key: 'endYear',
  },
  {
    title: 'Thao tác',
    dataIndex: 'actions',
    key: 'actions',
    render: (_, record) => (
      <Button
        type="primary"
        style={{ backgroundColor: '#8C4F4F', borderColor: '#8C4F4F' }}
        onClick={() => handleEdit(record)}
      >
        Sửa
      </Button>
    ),
  },
];

const handleEdit = (record) => {
  console.log('record:', record);
};

const TrainingCycle = () => {


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chu kỳ đào tạo</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className='flex justify-between mb-10'>
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px', padding: '0.25rem 0.5rem' }} />

          <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
            <span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
              <FaPlus />Thêm
            </span>
          </Button>
        </div>
        <Table 
          dataSource={dataSource} 
          columns={columns}
          pagination={{ pageSize: 3 }} 
          scrollToFirstRowOnChange={true} />;
      </div>
    </div>
  );
};

export default TrainingCycle; 