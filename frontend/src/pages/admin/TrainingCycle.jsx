import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Input, Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import { removeVietnameseTones } from "../../helpers/regex";
import { getAllTraningCycle } from "../../services/trainingCycleServices";


const TrainingCycle = () => {
	
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
      const fetchAPI = async () => {
		const result = await getAllTraningCycle();
        const dataNew = result.map((item, index) => ({
          ...item,
          key: index + 1,
        }));
       setData(dataNew);
      }
      fetchAPI();
    },[])
	
	const columns = [
	  {
	    title: 'STT',
	    dataIndex: 'key',
	    key: 'key',
	  },
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
	    key: 'action',
	    render: (text, record) => (
	      <div className="flex gap-2">
	        <Link to={`/admin/training-cycle/edit/${record.id}`} state={{ record }}>
	          <Button type="default">Sửa</Button>
	        </Link>
	        <Link to={`/admin/training-cycle/detail/${record.id}`} state={{ record }}>
	          <Button type="primary">Xem chi tiết</Button>
	        </Link>
	      </div>
	    ),
	  },
	];


  const filteredData = searchTerm
    ? data.filter((item) =>
        removeVietnameseTones(item.name).includes(
          removeVietnameseTones(searchTerm)
        )
      )
    : data
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chu kỳ đào tạo</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className='flex justify-between mb-10'>
          <Input
            placeholder="Tìm kiếm..."
            style={{ width: '250px', padding: '0.25rem 0.5rem' }} 
			value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>

          <Link to="/admin/training-cycle/create">
            <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
              <span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
                <FaPlus />Thêm
              </span>
            </Button>
          </Link>
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 3 }}
          scrollToFirstRowOnChange={true} />
      </div>
    </div>
  );
};

export default TrainingCycle; 