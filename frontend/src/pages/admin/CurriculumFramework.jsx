
import { Table, Button, Radio, Input, message, Modal } from 'antd';
import { Select, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { getAllTraningCycle } from "../../services/trainingCycleServices";
import { createGeneralInformation, updateGeneralInformation, deleteGeneralInformation } from "../../services/generalInformationServices";
import { getByInformationId } from "../../services/teachingPlanServices";
const { confirm } = Modal;




const CurriculumFramework = () => {
  const [trainingCycles, setTrainingCycles] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      const result1 = await getAllTraningCycle();
      setTrainingCycles(result1);
    }
    fetchAPI();
  }, []);

  // const handleShowCurriculumFramework = (Id) => {
  //   //Id cua khung chuong trinh
  //   const data = curriculum_framework_list.find((item) => item.Id = Id).Details
  //   setData(data);
  //   setColumns(columns2);
  // }

  // const handleBack = () => {
  //   setData(curriculum_framework_list);
  //   setColumns(columns1);
  // }

  return (
    <div className='flex flex-col gap-5 mt-10'>

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
                  <Link to={`/admin/curriculum-framework/${faculty.trainingCycleFacultyList[0].generalInformation.id}`} className="text-blue-500 underline">Xem chi tiết</Link>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
      {/* {!showFormUpdate && selectFaculty && Object.keys(selectFaculty).length > 0 && (
        <GeneralInformationDetail faculty={selectFaculty} />
      )}
      {showFormAdd && <FormAdd />}
      {showFormUpdate && <FormUpdate />} */}


    </div>
  );
};

export default CurriculumFramework; 