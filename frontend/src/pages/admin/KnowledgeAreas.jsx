import { Table, Button, Radio, Input, Select } from 'antd';
import { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FaPlus } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import "../../index.css";
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
    const [showFormAdd, setShowFormAdd] = useState(false);
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

    const FormAdd = () => {
        const [valueName, setValueName] = useState("")
        const [selectValue, setSelectValue] = useState(1);
        const [valueRadio, setValueRadio] = useState(1);
        const handleChange = (value) => {
            setSelectValue(value);
        };

        const handleSubmitForm = (e) => {
            e.preventDefault();
            alert('hi')
            console.log({
                name: valueName,
                parentId: selectValue,
                isCountCredit: valueRadio,
            });
            // gọi API hoặc xử lý dữ liệu ở đây
        };

        const options = list_knowledge_areas
            .filter((item) => item.Id_Parent === 0)
            .map((item) => ({
                value: item.Id,
                label: item.Name
            }));

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
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center">
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

                    <div className='flex gap-5  w-full items-center'>
                        <span className=''>Tính vào tính chỉ tích lũy</span>
                        <RadioGroupDemo />
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
            <TableData />
            {showFormAdd && <FormAdd />}
        </div>

    );
}

export default KnowledgeAreas;
