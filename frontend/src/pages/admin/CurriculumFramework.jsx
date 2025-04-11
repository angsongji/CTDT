import React, { useState } from 'react';
import { Table, Button, Input } from 'antd';
import { FaPlus } from "react-icons/fa6";


const curriculum_framework_list = [
  {
    Id: 1,
    Name_program: "Chuong trinh dao tao 2020 - 2024",
    Name_faculty: "Cong nghe thong tin",
    Status: 1,
    Details: [
      {
        Id: 1,
        Name: "Khoi kien thuc giao duc dai cuong",
        Id_Parent: 0,
        Use: 1
      },
      {
        Id: 2,
        Name: "Kien thuc giao duc the chat va giao duc quoc phong va an ninh",
        Id_Parent: 1,
        Use: 0
      }
    ]
  },
  {
    Id: 2,
    Name_program: "Chuong trinh dao tao 2020 - 2024",
    Name_faculty: "Ke toan",
    Status: 1,
    Details: [
      {
        Id: 1,
        Name: "Khoi kien thuc giao duc dai cuong",
        Id_Parent: 0,
        Use: 1
      },
      {
        Id: 2,
        Name: "Kien thuc giao duc the chat va giao duc quoc phong va an ninh",
        Id_Parent: 1,
        Use: 0
      }
    ]
  }
]


const CurriculumFramework = () => {
  const columns1 = [
    {
      title: "",
      dataIndex: "stt",
      key: "stt",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Ten chuong trinh',
      dataIndex: 'Name_program',
      key: 'Name_program',
    },
    {
      title: 'Ten nganh',
      dataIndex: 'Name_faculty',
      key: 'Name_faculty',
    },
    {
      title: '',
      render: (row) => (<div className="underline text-blue-400 cursor-pointer" onClick={() => handleShowCurriculumFramework(row.Id)}>Xem chi tiet</div>)
    }
  ];
  const columns2 = [
    {
      title: 'Cac khoi kien thuc',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'So tin chi bat buoc',
      dataIndex: 'Name_faculty',
      key: 'Name_faculty',
    },
    {
      title: 'So tin chi tu chon',
      dataIndex: 'Name_faculty',
      key: 'Name_faculty',
    }
  ];
  const [data, setData] = useState(curriculum_framework_list);
  const [columns, setColumns] = useState(columns1);


  const handleShowCurriculumFramework = (Id) => {
    //Id cua khung chuong trinh
    const data = curriculum_framework_list.find((item) => item.Id = Id).Details
    setData(data);
    setColumns(columns2);
  }

  const handleBack = () => {
    setData(curriculum_framework_list);
    setColumns(columns1);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Khung chương trình</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {
          columns.length != 4 && <div className='underline text-blue-400 cursor-pointer text-sm' onClick={() => handleBack()}>Back</div>
        }
        <div className="py-4">
          <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />

        </div>
      </div>
    </div >
  );
};

export default CurriculumFramework; 