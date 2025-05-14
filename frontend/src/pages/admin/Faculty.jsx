import { Table, Button, Radio, Input, message, Modal } from 'antd';
import { Select, Dropdown } from "antd";
import { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { getAllFaculties, createFaculty, updateFaculty, deleteFaculty } from "../../services/facultyServices";
const { confirm } = Modal;

function Faculty() {
    const [showFormAdd, setShowFormAdd] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [valueSearch, setValueSearch] = useState("");
    const [Faculties, setFaculties] = useState([]);
    const [FacultiesSearch, setFacultiesSearch] = useState([]);
    const [facultyUpdate, setFacultyUpdate] = useState({});
    const columns = [
        {
            title: 'Mã ngành',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên ngành',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer" className='!text-[var(--medium-pink2)] !underline'>
                    {text}
                </a>
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

    const handleMenuClick = (key, record) => {
        if (key === "edit") {
            setFacultyUpdate(record);
            setShowFormUpdate(true);
            console.log("Sửa:", record);
        } else if (key === "delete") {
            confirm({
                title: 'Bạn có chắc chắn muốn xóa?',
                content: 'Hành động này không thể hoàn tác.',
                okText: 'Xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                onOk() {
                    handleDeleteFaculty(record.id);
                },
                onCancel() {
                    console.log('Hủy xóa');
                },
            });
        }
    };

    const handleDeleteFaculty = async (id) => {
        try {
            message.loading({ content: "Đang xóa...", key: "delete" });
            const result = await deleteFaculty(id);
            if (result.status === 200) {
                message.success({ content: "Xóa thành công!", key: "delete", duration: 2, style: { marginTop: '1vh' } });
                setFaculties(prev => prev.filter(item => item.id !== id));
            }else if(result.status === 409){
                message.error({ content: result.message, key: "delete", duration: 2, style: { marginTop: '1vh' } });
            }
        } catch (error) {
            console.log(error);
            message.error({
                content: error.message,
                duration: 2,
                key: "delete",
                style: { marginTop: '1vh' },
            });
        }
    };

    useEffect(() => {
        const fetchAPI = async () => {
            const result = await getAllFaculties();
            setFaculties(result.data);
        }
        fetchAPI();
    }, []);

    useEffect(() => {
        if (valueSearch !== "") {
            const filteredData = Faculties.filter(item => item.name.toLowerCase().includes(valueSearch.toLowerCase()));
            setFacultiesSearch(filteredData);
        }
    }, [valueSearch]);

    const FormAdd = () => {
        const [valueName, setValueName] = useState("")
        const [valueWebsite, setValueWebsite] = useState("")
        const [isLoading, setIsLoading] = useState(false);
        const handleSubmitForm = (e) => {
            e.preventDefault();
            if (valueName.trim() !== "" && Faculties.find(item => item.name.toLowerCase() === valueName.trim().toLowerCase())) {
                message.error("Tên đã tồn tại");
                return;
            }
            const dataAdd = { name: valueName };
            if(valueWebsite !== "") {
                dataAdd.website = valueWebsite;
            }
            console.log(dataAdd);
            const addAPI = async () => {
                            try {
                                setIsLoading(true);
                                message.loading({ content: "Đang tạo...", key: "add" });
                                const result = await createFaculty(dataAdd);
                                console.log(result);
                                if (result.status === 200) {
                                    const newFaculty = result.data;
                                    setFaculties(prev => [...prev, newFaculty]);
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

        return (
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
                <form onSubmit={handleSubmitForm} className="relative text-sm w-[30vw] flex flex-col gap-10 bg-white p-5 rounded-md shadow-md flex items-center gap-5">
                    <div className='font-bold text-xl'>Thêm ngành đào tạo</div>
                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Tên ngành</span>
                        <Input
                            type="text"
                            required
                            onChange={(e) => setValueName(e.target.value)}
                            value={valueName}
                            placeholder="Nhập tên..."
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                            disabled={isLoading}
                        />
                    </div>

                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Đường dẫn website</span>
                        <Input
                            type="url"
                            onChange={(e) => setValueWebsite(e.target.value)}
                            value={valueWebsite}
                            placeholder="Website..."
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                            disabled={isLoading}
                        />  
                    </div>

                    <Button type='primary' htmlType="submit" disabled={isLoading} className='!my-3 !bg-[var(--medium-pink2)] !text-white'>
                        {isLoading ? "Đang thêm..." : "Thêm ngành"}
                    </Button>
                    <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
                        <HiX size={28} className='text-white' />
                    </div>
                </form>


            </div>
        );
    };

    const FormUpdate = ({facultyUpdate}) => {
        const [valueName, setValueName] = useState("")
        const [valueWebsite, setValueWebsite] = useState("")
        const [isLoading, setIsLoading] = useState(false);
        const handleSubmitForm = (e) => {
                    e.preventDefault();
                    if(valueName.trim() !== "" && Faculties.find(item => item.name.toLowerCase() === valueName.trim().toLowerCase())) {
                        message.error("Tên ngành đã tồn tại");
                        return;
                    }
                    confirm({
                        title: 'Bạn có chắc chắn muốn cập nhật?',
                        content: 'Hành động này không thể hoàn tác.',
                        okText: 'Cập nhật',
                        okType: 'primary',
                        cancelText: 'Hủy',
                        onOk() {
                            submitUpdate();
                        },
                        onCancel() {
                            console.log('Hủy cập nhật');
                        },
                    });
                    const submitUpdate = async () => {
                        setIsLoading(true);
                        try {
                            message.loading({ content: "Đang cập nhật...", key: "update" });
                            const dataUpdate = {
                                name: valueName == "" ? facultyUpdate.name : valueName,
                                website: valueWebsite == "" ? facultyUpdate.website : valueWebsite
                            }
                            const result = await updateFaculty(facultyUpdate.id, dataUpdate);
                            if (result.status === 200) {
                                message.success({ content: "Cập nhật thành công!", key: "update", duration: 2, style: { marginTop: '1vh' } });
                                setFaculties(prev => prev.map(item => item.id === facultyUpdate.id ? result.data : item));
                                setShowFormUpdate(false);
                            }
                        } catch (error) {
                            console.log(error);
                            message.error({
                                content: error.message,
                                duration: 2,
                                key: "update",
                                style: { marginTop: '1vh' },
                            });
                        } finally {
                            setIsLoading(false);
                        }
        
        
                    };
                }
        return (
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
                <form onSubmit={handleSubmitForm} className="relative text-sm w-[30vw] flex flex-col gap-10 bg-white p-5 rounded-md shadow-md flex items-center gap-5">
                    <div className='font-bold text-xl'>Chỉnh sửa ngành đào tạo</div>
                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Tên ngành</span>
                        <Input
                            type="text"
                            onChange={(e) => setValueName(e.target.value)}
                            value={valueName}
                            placeholder={facultyUpdate.name}
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                            disabled={isLoading}
                        />
                    </div>

                    <div className='w-full flex items-center'>
                        <span className='flex-1 '>Đường dẫn website</span>
                        <Input
                            type="url"

                            onChange={(e) => setValueWebsite(e.target.value)}
                            value={valueWebsite}
                            placeholder={facultyUpdate.website}
                            style={{ width: "60%", padding: '0.25rem 0.5rem' }}
                            disabled={isLoading}
                        />  
                    </div>

                    <Button type='primary' htmlType="submit" disabled={isLoading} className='!my-3 !bg-[var(--medium-pink2)] !text-white'>
                        {isLoading ? "Đang chỉnh sửa..." : "Lưu thay đổi"}
                    </Button>
                    <div onClick={() => setShowFormUpdate(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
                        <HiX size={28} className='text-white' />
                    </div>
                </form>


            </div>
        );
    };


    return (
        <div className='flex flex-col gap-5 mt-10'>
            {/* Hiện tìm kiếm vào các nút thao tác */}
            <div className='flex justify-between'>
                <div className='w-[50%] flex items-center'>
                    <Input
                        type="text"
                        required
                        onChange={(e) => setValueSearch(e.target.value)}
                        value={valueSearch}
                        placeholder="Nhập tên ngành"
                        style={{ width: "80%", padding: '0.25rem 0.5rem' }}
                        disabled={false}
                        allowClear
                    />
                </div>
                <Button type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'>
                    <span onClick={() => setShowFormAdd(true)} className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'>
                        <FaPlus />Thêm ngành
                    </span>
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={valueSearch !== "" ? FacultiesSearch : Faculties}
                pagination={{ pageSize: 5 }}
                scrollToFirstRowOnChange={true}
            />
            {showFormAdd && <FormAdd />}
            {showFormUpdate && <FormUpdate facultyUpdate={facultyUpdate} />}
        </div>

    );
}

export default Faculty;
