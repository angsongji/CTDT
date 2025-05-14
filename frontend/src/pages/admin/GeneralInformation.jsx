
import { Table, Button, Radio, Input, message, Modal } from 'antd';
import { Select, Dropdown } from "antd";
import { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { createGeneralInformation, updateGeneralInformation, deleteGeneralInformation } from "../../services/generalInformationServices";
const { confirm } = Modal;

const GeneralInformation = () => {
  const [valueSearch, setValueSearch] = useState("");
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [selectFaculty, setSelectFaculty] = useState({});
  const [selectTrainingCycle, setSelectTrainingCycle] = useState({});
  const [trainingCycles, setTrainingCycles] = useState([]);


  useEffect(() => {
    const fetchAPI = async () => {
      const result1 = await getAllTraningCycle();
      setTrainingCycles(result1);
    }
    fetchAPI();
  }, []);

  const handleMenuClick = (key, trainingCycle, faculty) => {
    if (key === "edit") {
      setSelectFaculty(faculty);
      setSelectTrainingCycle(trainingCycle);
      if (faculty.trainingCycleFacultyList[0].generalInformation) {
        setShowFormUpdate(true);
      } else {
        message.error("Chưa có thông tin chung của ngành này!");
      }
    } else if (key === "delete") {
      const generalInformationId = faculty.trainingCycleFacultyList[0].generalInformation?.id;
      console.log(generalInformationId);
      if (generalInformationId) {
        confirm({
          title: 'Bạn có chắc chắn muốn xóa?',
          content: 'Hành động này sẽ xóa toàn bộ các kế hoạch dạy học (nếu có) và không thể hoàn tác!',
          okText: 'Xóa',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk() {
            handleDeleteGeneralInformation();
          },
          onCancel() {
            console.log('Hủy xóa');
          },
        });
      } else {
        message.error("Chưa có thông tin chung của ngành này!");
      }

    } else if (key === "detail") {
      setSelectFaculty(faculty);
    }
  };

  const handleAddGeneralInformation = () => {
    const optionsTrainingCycles = trainingCycles
      .filter(tc => tc.faculties.length > 0)
      .filter(tc =>
        tc.faculties.some(faculty =>
          faculty.trainingCycleFacultyList.length > 0 &&
          faculty.trainingCycleFacultyList[0].generalInformation == null
        )
      );
    if(optionsTrainingCycles.length === 0){
      message.error("Không có ngành đào tạo theo chu kỳ nào trống thông tin chung!");
    }else{
      setShowFormAdd(true);
    }
  }
    

  const removeGeneralInformationById = (trainingCycles, idToRemove) => {
    return trainingCycles.map(trainingCycle => ({
      ...trainingCycle,
      faculties: trainingCycle.faculties.map(faculty => ({
        ...faculty,
        trainingCycleFacultyList: faculty.trainingCycleFacultyList.map(tcf => ({
          ...tcf,
          generalInformation: tcf.generalInformation && tcf.generalInformation.id === idToRemove
            ? null
            : tcf.generalInformation
        }))
      }))
    }));
  };

  const handleDeleteGeneralInformation = async (id) => {
    try {
      message.loading({ content: "Đang xóa...", key: "delete" });
      const result = await deleteGeneralInformation(id);
      if (result.status === 200) {
        message.success({ content: "Xóa thành công!", key: "delete", duration: 2, style: { marginTop: '1vh' } });
        const updatedList = removeGeneralInformationById(trainingCycles, id);
        setTrainingCycles(updatedList);
      } else if (result.status === 409) {
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

  const GeneralInformationDetail = ({ faculty }) => {


    const trainingCycleFacultyList = Array.isArray(faculty.trainingCycleFacultyList)
      ? faculty.trainingCycleFacultyList
      : [];

    const generalInformation = trainingCycleFacultyList[0]?.generalInformation;
    if (!generalInformation) {
      message.error("Chưa có thông tin chung của ngành này!");
      setSelectFaculty({});
      return null;
    }
    const title = [
      { value: "Tên gọi", key: "name" },
      { value: "Bậc", key: "level" },
      { value: "Loại bằng", key: "degreeType" },
      { value: "Loại hình đào tạo", key: "modeOfEducation" },
      { value: "Thời gian", key: "duration" },
      { value: "Số tín chỉ tối thiểu phải tích lũy", key: "credits" },
      { value: "Ngôn ngữ", key: "language" },
      { value: "Website", key: "website" },
      { value: "Ban hành", key: "issued" },
    ];

    const countCredit = () => {
      return 0; // Hoặc logic xử lý thực tế
    };

    return (
      <>
        {generalInformation && (
          <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">

            <div className="relative flex flex-col items-center justify-center gap-5 bg-white p-10 text-[var(--dark-pink)]">
              <div onClick={() => setSelectFaculty({})} className='cursor-pointer text-white absolute right-0 top-0 p-1 translate-x-[100%] translate-y-[-50%]'>
                <HiX size={28} />
              </div>
              <div className="font-bold text-xl ">Thông tin chung về {generalInformation.name}</div>
              <table className="table-auto w-[60vw] border text-left">
                <tbody>
                  {title.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">{item.value}</td>
                      {item.key === "website" ? (
                        <td className="border px-2 py-1">
                          <a
                            href={faculty[item.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {faculty[item.key] || "Chưa cập nhật"}
                          </a>
                        </td>
                      ) : item.key === "credits" ? (
                        <td className="border px-2 py-1">{countCredit()} tín chỉ</td>
                      ) : item.key === "duration" ? (
                        <td className="border px-2 py-1">{generalInformation[item.key]} năm</td>
                      ) : (
                        <td className="border px-2 py-1">{generalInformation[item.key] || "Chưa cập nhật"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        )
        }
      </>
    );
  };


  const ComboxFaculty = ({ selectValueTrainingCycle, setSelectValueFaculty, selectValueFaculty }) => {
    const [faculties, setFaculties] = useState([]);
    const [optionsFaculties, setOptionsFaculties] = useState([]);
    useEffect(() => {
      const trainingCycle = trainingCycles.find(item => item.id === selectValueTrainingCycle);
      if (trainingCycle) {
        const facultiesFilter = trainingCycle.faculties.filter(item => item.trainingCycleFacultyList[0].generalInformation == null);
        setFaculties(facultiesFilter);
        setSelectValueFaculty(facultiesFilter[0]?.id);
      }
    }, [selectValueTrainingCycle]);

    useEffect(() => {
      let optionsFaculties = faculties.map((item) => ({
        value: item.id,
        label: item.name
      }));
      setOptionsFaculties(optionsFaculties);
    }, [faculties]);

    const handleChange = (value) => {
      setSelectValueFaculty(value);
    };
    return <ComboBox options={optionsFaculties} onChange={handleChange} selectValue={selectValueFaculty} />
  }

  const ComboxTrainingCycle = ({ selectValueTrainingCycle, setSelectValueTrainingCycle }) => {
    const optionsTrainingCycles = trainingCycles
      .filter(tc => tc.faculties.length > 0)
      .filter(tc =>
        tc.faculties.some(faculty =>
          faculty.trainingCycleFacultyList.length > 0 &&
          faculty.trainingCycleFacultyList[0].generalInformation == null
        )
      )
      .map(tc => ({
        value: tc.id,
        label: tc.name
      }));
    setSelectValueTrainingCycle(optionsTrainingCycles[0]?.value);
    const handleChangeTrainingCycle = (value) => {
      setSelectValueTrainingCycle(value);
    };

    return (
      <ComboBox
        options={optionsTrainingCycles}
        onChange={handleChangeTrainingCycle}
        selectValue={selectValueTrainingCycle}
      />
    );
  };


  const ComboBox = ({ options, onChange, selectValue }) => {
    return (
      <Select
        style={{ width: "full" }}
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

  const FormAdd = () => {
    const [dataAdd, setDataAdd] = useState({
      name: "",
      level: "",
      degreeType: "Cử nhân",
      modeOfEducation: "Chính quy",
      duration: 4,
      language: "Tiếng Việt",
      issued: "",
      status: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectValueTrainingCycle, setSelectValueTrainingCycle] = useState(0);
    const [selectValueFaculty, setSelectValueFaculty] = useState(0);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setDataAdd(prev => ({
        ...prev,
        [name]: value
      }));
    };

    useEffect(() => {
      if (selectValueFaculty === 0) return;
      const trainingCycle = trainingCycles.find(item => item.id === selectValueTrainingCycle);
      const faculty = trainingCycle.faculties.find(item => item.id === selectValueFaculty);
      setDataAdd(prev => ({
        ...prev,
        name: "Chương trình đào tạo " + faculty?.name
      }));
    }, [selectValueFaculty]);

    const handleSubmitForm = async (e) => {
      e.preventDefault();
      try {
        //Them doan ma tim trainingCycleFacultyid
        const trainingCycle = trainingCycles.find(item => item.id === selectValueTrainingCycle);
        const faculty = trainingCycle.faculties.find(item => item.id === selectValueFaculty);
        const trainingCycleFaculty = faculty.trainingCycleFacultyList[0];
        dataAdd.trainingCycleFaculty = { id: trainingCycleFaculty.id };
        setIsLoading(true);
        message.loading({ content: "Đang tạo thông tin chung...", key: "add" });
        const result = await createGeneralInformation(dataAdd);
        if (result.status === 200) {
          const trainingCyclesUpdate = updateTrainingCycleWithGeneralInfo(selectValueTrainingCycle, selectValueFaculty, result.data);
          console.log(trainingCyclesUpdate);
          setTrainingCycles(trainingCyclesUpdate);
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
    };

    const updateTrainingCycleWithGeneralInfo = (selectValueTrainingCycle, facultyId, generalInformation) => {
      return trainingCycles.map((tc) => {
        if (tc.id !== selectValueTrainingCycle) return tc;

        return {
          ...tc,
          faculties: tc.faculties.map((faculty) => {
            if (faculty.id !== facultyId) return faculty;

            return {
              ...faculty,
              trainingCycleFacultyList: faculty.trainingCycleFacultyList.map((item) => {
                return {
                  ...item,
                  generalInformation: generalInformation
                };
              })
            };
          })
        };
      });
    };


    return (
      <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
        <form onSubmit={handleSubmitForm} className="relative text-sm w-[50vw] flex flex-col gap-5 bg-white p-5 rounded-md shadow-md">
          <div className='font-bold text-xl text-center'>Thêm thông tin chung</div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Tên gọi</span>
            <Input
              type="text"
              required
              name="name"
              onChange={handleChange}
              value={dataAdd.name}
              placeholder="Tên tự động tạo ra sau khi chọn ngành"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={true}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Bậc</span>
            <Input
              type="text"
              required
              name="level"
              onChange={handleChange}
              value={dataAdd.level}
              placeholder="Nhập bậc"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Loại bằng</span>
            <Input
              type="text"
              required
              name="degreeType"
              onChange={handleChange}
              value={dataAdd.degreeType}
              placeholder="Nhập loại bằng"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Loại hình đào tạo</span>
            <Input
              type="text"
              required
              name="modeOfEducation"
              onChange={handleChange}
              value={dataAdd.modeOfEducation}
              placeholder="Nhập loại hình đào tạo"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Thời gian (năm)</span>
            <Input
              type="number"
              required
              name="duration"
              onChange={handleChange}
              value={dataAdd.duration}
              min={3}
              max={10}
              step={0.5}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ngôn ngữ</span>
            <Input
              type="text"
              required
              name="language"
              onChange={handleChange}
              value={dataAdd.language}
              placeholder="Nhập ngôn ngữ"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ban hành</span>
            <Input
              type="text"
              required
              name="issued"
              onChange={handleChange}
              value={dataAdd.issued}
              placeholder="Nhập thông tin ban hành"
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex gap-5'>
            <div className='flex-1 flex gap-2 flex-col '>
              <span className='w-fit'>Chọn chu kỳ đào tạo</span>
              <ComboxTrainingCycle className="w-full" selectValueTrainingCycle={selectValueTrainingCycle} setSelectValueTrainingCycle={setSelectValueTrainingCycle} />
            </div>
            <div className='w-[50%] flex gap-2 flex-col '>
              <span className='w-fit'>Chọn ngành đào tạo (theo chu kỳ đào tạo)</span>
              <ComboxFaculty className="w-full" selectValueTrainingCycle={selectValueTrainingCycle} setSelectValueFaculty={setSelectValueFaculty} selectValueFaculty={selectValueFaculty} />
            </div>

          </div>

          {!isLoading ?
            <Button type='primary' htmlType="submit" className='!my-3 !bg-[var(--medium-pink2)] !text-white'>Thêm thông tin</Button> :
            <Button type='primary' htmlType="button" disabled={isLoading} className='!my-3 !bg-gray-400 !text-white'>Đang tạo</Button>
          }

          {!isLoading &&
            <div onClick={() => setShowFormAdd(false)} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
              <HiX size={28} className='text-white' />
            </div>
          }
        </form>
      </div>
    );
  }

  const FormUpdate = () => {
    const [dataUpdate, setDataUpdate] = useState({
      name: selectFaculty.trainingCycleFacultyList[0].generalInformation.name,
      level: selectFaculty.trainingCycleFacultyList[0].generalInformation.level,
      degreeType: selectFaculty.trainingCycleFacultyList[0].generalInformation.degreeType,
      modeOfEducation: selectFaculty.trainingCycleFacultyList[0].generalInformation.modeOfEducation,
      duration: selectFaculty.trainingCycleFacultyList[0].generalInformation.duration,
      language: selectFaculty.trainingCycleFacultyList[0].generalInformation.language,
      issued: selectFaculty.trainingCycleFacultyList[0].generalInformation.issued,
      status: 1,
      trainingCycleFaculty: {
        id: selectFaculty.trainingCycleFacultyList[0].id
      }
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setDataUpdate(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmitForm = async (e) => {
      e.preventDefault();
      try {
        const generalInformationId = selectFaculty.trainingCycleFacultyList[0].generalInformation.id;
        setIsLoading(true);
        message.loading({ content: "Đang cập nhật thông tin chung...", key: "update" });
        const result = await updateGeneralInformation(generalInformationId, dataUpdate);
        if (result.status === 200) {
          const trainingCyclesUpdate = updateTrainingCycleWithGeneralInfo(
            selectTrainingCycle.id,
            selectFaculty.id,
            result.data
          );
          setTrainingCycles(trainingCyclesUpdate);
          message.success({ content: "Cập nhật thành công!", key: "update", duration: 2, style: { marginTop: '1vh' } });
          setShowFormUpdate(false);
          setSelectFaculty({});
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

    const updateTrainingCycleWithGeneralInfo = (trainingCycleId, facultyId, generalInformation) => {
      return trainingCycles.map((tc) => {
        if (tc.id !== trainingCycleId) return tc;

        return {
          ...tc,
          faculties: tc.faculties.map((faculty) => {
            if (faculty.id !== facultyId) return faculty;

            return {
              ...faculty,
              trainingCycleFacultyList: faculty.trainingCycleFacultyList.map((item) => {
                return {
                  ...item,
                  generalInformation: generalInformation
                };
              })
            };
          })
        };
      });
    };

    return (
      <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
        <form onSubmit={handleSubmitForm} className="relative text-sm w-[50vw] flex flex-col gap-5 bg-white p-5 rounded-md shadow-md">
          <div className='font-bold text-xl text-center'>Cập nhật thông tin chung</div>


          <div className='w-full flex items-center'>
            <span className='flex-1'>Bậc</span>
            <Input
              type="text"
              required
              name="level"
              onChange={handleChange}
              value={dataUpdate.level}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.level}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Loại bằng</span>
            <Input
              type="text"
              required
              name="degreeType"
              onChange={handleChange}
              value={dataUpdate.degreeType}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.degreeType}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Loại hình đào tạo</span>
            <Input
              type="text"
              required
              name="modeOfEducation"
              onChange={handleChange}
              value={dataUpdate.modeOfEducation}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.modeOfEducation}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Thời gian (năm)</span>
            <Input
              type="number"
              required
              name="duration"
              onChange={handleChange}
              value={dataUpdate.duration}
              min={3}
              max={10}
              step={0.5}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.duration}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ngôn ngữ</span>
            <Input
              type="text"
              required
              name="language"
              onChange={handleChange}
              value={dataUpdate.language}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.language}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          <div className='w-full flex items-center'>
            <span className='flex-1'>Ban hành</span>
            <Input
              type="text"
              required
              name="issued"
              onChange={handleChange}
              value={dataUpdate.issued}
              placeholder={selectFaculty.trainingCycleFacultyList[0].generalInformation.issued}
              style={{ width: "80%", padding: '0.25rem 0.5rem' }}
              disabled={isLoading}
            />
          </div>

          {!isLoading ?
            <Button type='primary' htmlType="submit" className='!my-3 !bg-[var(--medium-pink2)] !text-white'>Cập nhật thông tin</Button> :
            <Button type='primary' htmlType="button" disabled={isLoading} className='!my-3 !bg-gray-400 !text-white'>Đang cập nhật</Button>
          }

          {!isLoading &&
            <div onClick={() => { setShowFormUpdate(false); setSelectFaculty({}); }} className='cursor-pointer absolute right-0 translate-x-[120%] translate-y-[-120%]'>
              <HiX size={28} className='text-white' />
            </div>
          }
        </form>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='flex justify-end'>
        <Button onClick={() => handleAddGeneralInformation()} type='primary' className='!bg-[var(--dark-pink)] hover:!bg-[var(--medium-pink2)]'><span className=' text-white px-2 py-1 rounded-md flex items-center  justify-center gap-1'><FaPlus />Thêm</span></Button>
      </div>

      <table className="w-full text-center text-sm " style={{ fontFamily: "Arial" }}>
        <thead className="bg-[var(--dark-pink)] text-white h-[8vh]" >
          <tr>
            <th className="border-r-1 border-white">STT</th>
            <th className="border-r-1 border-white">Tên chu kỳ đào tạo</th>
            <th className="border-r-1 border-white">Tên ngành đào tạo</th>
            <th className="border-r-1 border-white">&nbsp;</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {trainingCycles.map((trainingCycle, index) => {
            return trainingCycle.faculties.map((faculty, facultyIndex) => (
              <tr key={`${trainingCycle.id}-${facultyIndex}`} className=''>
                {/* Chỉ hiển thị STT và tên chu kỳ ở dòng đầu tiên */}
                {facultyIndex === 0 && (
                  <>
                    <td rowSpan={trainingCycle.faculties.length} className='py-5'>{index + 1}</td>
                    <td rowSpan={trainingCycle.faculties.length} className='py-5'>{trainingCycle.name}</td>
                  </>
                )}
                <td className='py-5'>{faculty.name}</td>
                <td className='py-5 flex items-center justify-center'>
                  <Dropdown
                    menu={{
                      items: [
                        { key: "detail", label: "Xem thông tin chung" },
                        { key: "edit", label: "Chỉnh sửa" },
                        { key: "delete", label: "Xóa", danger: true },
                      ],
                      onClick: ({ key }) => handleMenuClick(key, trainingCycle, faculty),
                    }}
                    trigger={["click"]}
                  >
                    <span className="cursor-pointer">
                      <FaEllipsisV className="text-gray-500 hover:text-[var(--main-green)]" />
                    </span>
                  </Dropdown>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
      {!showFormUpdate && selectFaculty && Object.keys(selectFaculty).length > 0 && (
        <GeneralInformationDetail faculty={selectFaculty} />
      )}
      {showFormAdd && <FormAdd />}
      {showFormUpdate && <FormUpdate />}


    </div>
  );
};

export default GeneralInformation; 