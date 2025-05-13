import { Table, Button, Radio, Input, message } from 'antd';
import { Select,  Dropdown } from "antd";
import { useState, useEffect } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { getAllKnowledgeAreas, createKnowledgeArea } from "../../services/knowledgeAreasServices";

//Xử lí chọn menu
const handleMenuClick = (key, record) => {
    if (key === "edit") {
        // setUser(record);
        message.success({
            content: "Sửa!",
            duration: 2,
            style: { marginTop: '1vh' },
        });
        console.log("Sửa:", record);
    } else if (key === "delete") {
        message.error({
            content: "Xóa!",
            duration: 2,
            style: { marginTop: '1vh' },
        });
        console.log("Xóa:", record);
    }
};

const columns = [
    {
        title: '',
        dataIndex: '',
        key: '',
    },
    {
        title: 'Mã khối',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tên khối kiến thức',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Tính vào tín chỉ tích lũy',
        dataIndex: 'usage_count',
        key: 'usage_count',
        align: 'center', // Căn giữa cột
        render: (use) =>
            use === 1 ? (
                <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
            ) : (
                <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
            ),
    },
    {
        title: "",
        key: "action",
        render: (record) => (
            <Dropdown
                menu={{
                    items: [
                        { key: "edit", label: "Chỉnh sửa" },
                        { key: "delete", label: "Xóa", danger: true },
                    ],
                    onClick: ({ key }) => handleMenuClick(key, record),
                }}
                trigger={["click"]}
            >
                <span className="cursor-pointer">
                    <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
                </span>
            </Dropdown>
        ),
    },
];


function KnowledgeAreas() {
    const [showFormAdd, setShowFormAdd] = useState(false);
    const [KnowledgeAreasList, setKnowledgeAreasList] = useState([]);
    const [KnowledgeAreasListAll, setKnowledgeAreasListAll] = useState([]);

    useEffect(() => {
        const fetchAPI = async () => {
            const result = await getAllKnowledgeAreas();
            const filteredData = result.data.filter(item => item.parent_id === 0);
            setKnowledgeAreasList(filteredData);
            setKnowledgeAreasListAll(result.data);
        }
        fetchAPI();
    }, [])


    const FormAdd = () => {
        const [valueName, setValueName] = useState("")
        const [selectValue, setSelectValue] = useState(0);
        const [valueRadio, setValueRadio] = useState(1);
        const handleChange = (value) => {
            setSelectValue(value);
        };

        const handleSubmitForm = (e) => {
            e.preventDefault();
            if (valueName.trim() !== "" && KnowledgeAreasList.find(item => item.name.toLowerCase() === valueName.toLowerCase())) {
                message.error("Tên đã tồn tại");
                return;
            }
            const dataAdd = {
                name: valueName,
                usage_count: valueRadio,
            }
            if(selectValue !== 0){
                dataAdd.parent = {id: selectValue}
            }
            
            console.log(dataAdd);
            const addAPI = async () => {
                const result = await createKnowledgeArea(dataAdd);
                console.log(result);
                if(result.status === 201){
                    if(selectValue !== 0){
                        const updatedList = KnowledgeAreasList.map(item => {
                            if (item.id === selectValue) {
                              return {
                                ...item,
                                children: [...item.children, result.data],
                              };
                            }
                            return item;
                          });
                          console.log(updatedList);
                          setKnowledgeAreasList(updatedList);                          
                    }else{
                        setKnowledgeAreasList(prev => [...prev, result.data]);
                    }
                    message.success({
                        content: "Thêm thành công!",
                        duration: 2,
                        style: { marginTop: '1vh' },
                    });
                    setShowFormAdd(false);
                }
            }
            addAPI();
            
        };

        let options = KnowledgeAreasListAll.map((item) => ({
                value: item.id,
                label: item.name
            }));
        
        options.unshift({ value: 0, label: "Bỏ qua" });

        const ComboBox = ({ options, onChange }) => {
            return (
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn một mục"
                    onChange={onChange}
                    value={selectValue}
                    
                >
                    {options.map((item) => (
                        <Option key={item.value} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            );
        };
        const RadioGroupDemo = () => {


            const onChange = (e) => {
                console.log('radio checked', e.target.value);
                setValueRadio(e.target.value);
            };

            return (
                <Radio.Group onChange={onChange} value={valueRadio}>
                    <Radio value={1}>Có</Radio>
                    <Radio value={2}>Không</Radio>
                </Radio.Group>
            );
        };
        return (
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
                <form onSubmit={handleSubmitForm} className="relative text-sm w-[30vw] flex flex-col gap-10 bg-white p-5 rounded-md shadow-md flex items-center gap-5">
                    <div className='font-bold text-xl'>Thêm khối kiến thức</div>
                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Tên khối</span>
                        <Input
                            type="text"
                            required
                            onChange={(e) => setValueName(e.target.value)}
                            value={valueName}
                            placeholder="Nhập tên"
                            style={{ width: "80%", padding: '0.25rem 0.5rem' }}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full  ' >
                        <span>Chọn khối kiến thức cha</span>
                        <ComboBox options={options} onChange={handleChange} />
                    </div>

                    
                        
                            <div className='flex gap-5  w-full items-center h-10'>
                            {
                            selectValue !== 0 &&   
                                <>
                                <span className=''>Tính vào tính chỉ tích lũy</span>
                                <RadioGroupDemo />
                                </>
                            }
                            </div>
                        
                      
                    
                    <Button type='primary' htmlType="submit" className='!my-3 !bg-[var(--medium-pink2)] !text-white'>Thêm khối</Button>
                    <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
                        <HiX size={28} className='text-white' />
                    </div>
                </form>


            </div>
        );
    };

    return (
        <div className='flex flex-col gap-5 mt-10'>
            {/* Hiện tìm kiếm vào các nút thao tác */}
            <div className='flex justify-end'>
                <Button onClick={() => setShowFormAdd(true)} type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'><span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'><FaPlus />Thêm khối</span></Button>
            </div>
            {/* <TableData /> */}
            <Table
    columns={columns}
    dataSource={KnowledgeAreasList}
    pagination={{ pageSize: 6 }}
    rowKey="id"
    scrollToFirstRowOnChange={true}
    expandable={{
        childrenColumnName: "children",
        defaultExpandAllRows: true,
    }}
/>

            {showFormAdd && <FormAdd />}
        </div>

    );
}

export default KnowledgeAreas;