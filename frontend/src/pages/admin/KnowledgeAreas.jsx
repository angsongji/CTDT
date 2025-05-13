import { Table, Button, Radio, Input, message } from 'antd';
import { Select, Dropdown } from "antd";
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
    const [KnowledgeAreasList, setKnowledgeAreasList] = useState([]); //Lọc ra chỉ chứa các know với parent_id = 0
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
        const [isLoading, setIsLoading] = useState(false);
        const handleChange = (value) => {
            setSelectValue(value);
        };

        function addKnowledgeToTree(tree, newKnowledge) {
            return tree.map(node => {
                if (node.id === newKnowledge.parent_id) {
                    return {
                        ...node,
                        children: [...node.children, newKnowledge],
                    };
                }
                if (node.children && node.children.length > 0) {
                    return {
                        ...node,
                        children: addKnowledgeToTree(node.children, newKnowledge),
                    };
                }
                return node;
            });
        }


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
            if (selectValue !== 0) {
                dataAdd.parent = { id: selectValue }
            }

            console.log(dataAdd);
            const addAPI = async () => {
                try {
                    setIsLoading(true);
                    message.loading({ content: "Đang tạo...", key: "add" });
                    const result = await createKnowledgeArea(dataAdd);
                    console.log(result);
                    if (result.status === 201) {
                        const newKnowledge = result.data;
                        if (newKnowledge.parent_id !== 0) {
                            const updatedList = addKnowledgeToTree(KnowledgeAreasList, newKnowledge);
                            setKnowledgeAreasList(updatedList);
                        } else {
                            // Trường hợp root knowledge
                            setKnowledgeAreasList(prev => [...prev, newKnowledge]);
                        }
                        setKnowledgeAreasListAll(prev => [...prev, newKnowledge]);
                        message.success({ content: "Thêm thành công!", key: "add", duration: 2, style: { marginTop: '1vh' } });
                        setShowFormAdd(false);
                    }
                } catch (error) {
                    console.log(error);
                    message.error({
                        content: error.message,
                        duration: 2,
                        key: "add",
                        style: { marginTop: '1vh' },
                    });
                } finally {
                    setIsLoading(false);
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
                    disabled={isLoading}

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
                            disabled={isLoading}
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


                    {
                        !isLoading ? <Button type='primary' htmlType="submit" className='!my-3 !bg-[var(--medium-pink2)] !text-white'>Thêm khối</Button> :
                            <Button type='primary' htmlType="button" disabled={isLoading} className='!my-3 !bg-gray-400 !text-white'>Đang tạo</Button>
                    }
                    {
                        !isLoading && <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
                            <HiX size={28} className='text-white' />
                        </div>
                    }

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
                    expandIcon: ({ expanded, onExpand, record }) => {
                        if (record.children && record.children.length > 0) {
                            return (
                                <span
                                    onClick={e => onExpand(record, e)}
                                    className="text-xl cursor-pointer text-gray-600 "
                                >
                                    {expanded ? '−' : '+'}
                                </span>
                            );
                        }
                        return null; // Không hiển thị gì nếu không có con
                    }
                }}

            />

            {showFormAdd && <FormAdd />}
        </div>

    );
}

export default KnowledgeAreas;