import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getByInformationId } from "../../services/teachingPlanServices";
import { getAllKnowledgeAreas } from "../../services/knowledgeAreasServices";
import { message, Spin } from "antd";
import { HiX } from "react-icons/hi";

const CurriculumFrameworkDetail = () => {
    const [teachingPlans, setTeachingPlans] = useState([]);
    const { generalInformationId } = useParams();
    const [loading, setLoading] = useState(false);
    const [knowledgeAreas, setKnowledgeAreas] = useState([]);
    const [areaCredits, setAreaCredits] = useState([]);
    const [parentSummary, setParentSummary] = useState([]);
    const [areaId, setAreaId] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const teachingPlans = await getByInformationId(generalInformationId);
                const knowledgeAreas = await getAllKnowledgeAreas();
                setKnowledgeAreas(knowledgeAreas.data);
                setTeachingPlans(teachingPlans);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                return "Lỗi khi lấy dữ liệu";
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (teachingPlans.length > 0 && knowledgeAreas.length > 0) {
            const areaCreditMap = getCreditsPerArea(teachingPlans);
            const parentSummaryData = summarizeParentAreas(knowledgeAreas, areaCreditMap);
            setAreaCredits(areaCreditMap);
            setParentSummary(parentSummaryData);
        }
    }, [teachingPlans, knowledgeAreas]);

    function getCreditsPerArea(teachingPlan) {
        const areaCredits = {};

        for (const item of teachingPlan) {
            const area = item.course.knowledgeArea;
            const id = area.id;
            const name = area.name;
            const parent_id = area.parent_id;
            const credits = item.course.credits;
            const requirement = item.course.requirement; // 1: bắt buộc, 0: tự chọn
            const usage_count = area.usage_count;
            if (!areaCredits[id]) {
                areaCredits[id] = {
                    id,
                    name,
                    parent_id,
                    required: 0,
                    optional: 0,
                    usage_count,
                };
            }

            if (requirement === 1) {
                areaCredits[id].required += credits;
            } else {
                areaCredits[id].optional += credits;
            }
        }

        return areaCredits;
    }

    function summarizeParentAreas(knowledgeAreas, areaCredits) {
        const parentSummary = {};

        for (const parent of knowledgeAreas) {
            if (parent.parent_id !== 0) continue; // chỉ xử lý khối cha
            const parentId = parent.id;

            parentSummary[parentId] = {
                name: parent.name,
                required: 0,
                optional: 0,
                children: []
            };

            for (const child of parent.children) {
                const childData = areaCredits[child.id];

                if (childData) {
                    if (childData.usage_count > 0) {
                        parentSummary[parentId].required += childData.required;
                        parentSummary[parentId].optional += childData.optional;
                    }

                    parentSummary[parentId].children.push({
                        id: childData.id,
                        name: childData.name,
                        required: childData.required,
                        optional: childData.optional,
                        usage_count: childData.usage_count
                    });
                }
            }
        }

        return parentSummary;
    }

    const TableCurriculumFramework = ({ parentSummary }) => {
        return (
            <table className="w-full table-auto border border-[var(--light-pink)] rounded-xl overflow-hidden border-separate border-spacing-0">
                <thead className="text-center bg-[var(--dark-pink)] text-white ">
                    <tr className="">
                        <th rowSpan={2} className=" border px-4 py-2 ">Các khối kiến thức</th>
                        <th colSpan={2} className=" border px-4 py-2">Số tín chỉ</th>
                    </tr>
                    <tr className="">
                        <th className=" border px-4 py-2">Bắt buộc</th>
                        <th className=" border px-4 py-2">Tự chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(parentSummary).map(([parentId, block]) => (
                        <React.Fragment key={parentId}>
                            {/* Khối cha */}
                            <tr className=" bg-red-100 font-bold text-[var(--dark-pink)]">
                                <td className=" px-4 py-2 border-r-1 border-white">{block.name}</td>
                                <td className=" text-center border-r-1 border-white">{block.required}</td>
                                <td className=" text-center border-white">{block.optional}</td>
                            </tr>
                            {/* Các khối con */}
                            {block.children.map((child, index) => (
                                <tr key={`${parentId}-${index}`} className="text-[var(--dark-pink)] bg-white text-sm">
                                    {
                                        child.usage_count === 0 ? (
                                            <td className=" px-4 py-2 pl-8 border-r-1 border-white "><abbr title="Nhấn để xem danh sách học phần theo khối này"><span className="cursor-pointer hover:text-blue-500" onClick={() => { setAreaId(child.id); console.log(child.id) }}>{child.name} </span></abbr> <span className="text-red-500 italic">(Không tính vào tổng số tín chỉ tích lũy)</span></td>
                                        ) : (
                                            <td className=" px-4 py-2 pl-8 border-r-1 border-white"><abbr title="Nhấn để xem danh sách học phần theo khối này"><span className="cursor-pointer hover:text-blue-500" onClick={() => { setAreaId(child.id); console.log(child.id) }}>{child.name} </span></abbr></td>
                                        )
                                    }
                                    <td className=" px-4 py-2 text-center border-r-1 border-white">{child.required}</td>
                                    <td className=" px-4 py-2 text-center border-white">{child.optional}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    <tr className="bg-red-100 font-bold text-[var(--dark-pink)]">
                        <td className=" font-bold text-right py-2 border-r-1 border-white px-5">Tổng</td>
                        <td className=" font-bold text-center py-2 border-r-1 border-white">
                            {Object.values(parentSummary).reduce((total, area) => total + area.required, 0)}
                        </td>
                        <td className=" font-bold text-center py-2 border-white">
                            {Object.values(parentSummary).reduce((total, area) => total + area.optional, 0)}
                        </td>
                    </tr>
                    <tr className="border-t-1 bg-red-100 font-bold border-white text-red-500 text-center">
                        <td className=" font-bold  py-2 border-r-1 border-white ">Số tín chỉ tối thiểu phải tích lũy</td>
                        <td className=" font-bold  py-2 " colSpan={2}>
                            {Object.values(parentSummary).reduce((total, area) => total + area.optional + area.required, 0)}
                        </td>
                    </tr>


                </tbody>
            </table>
        );
    };

    const TableCourseByArea = ({ areaId, teachingPlans }) => {

        // Lọc các học phần thuộc khối kiến thức có id === areaId
        const courses = teachingPlans.filter(
            item => item.course.knowledgeArea.id === areaId
        );
        console.log(courses);
        return (
            <div className="fixed top-0 left-0 bottom-0 w-screen h-screen bg-black/50 flex items-center justify-center z-10">
                <div className="w-[80%] flex flex-col items-center justify-center bg-white p-5 rounded-lg" >
                    <div className="flex items-center justify-between w-full mb-5">
                        <div className="text-[var(--dark-pink)] font-bold text-xl">Danh sách các học phần</div>
                        <HiX onClick={() => setAreaId(0)} className="text-2xl cursor-pointer hover:text-red-500" />
                    </div>
                    <table className="w-full table-auto border border-white rounded-xl overflow-hidden border-separate border-spacing-0">
                        <thead className=" bg-[var(--dark-pink)] text-white">
                            <tr className="text-center  ">
                                <th className="border py-2 w-[15%]">Mã học phần</th>
                                <th className="border py-2 w-auto">Tên học phần</th>
                                <th className="border py-2 w-[10%]">Số tín chỉ</th>
                                <th className="border py-2 w-[10%]">Bắt buộc</th>
                                <th className="border py-2 w-[10%]">Tự chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((item, index) => (
                                <tr key={index} className="text-[var(--dark-pink)] bg-white text-sm text-center">
                                    <td className=" py-2 ">{item.course.id}</td>
                                    <td className=" py-2 ">{item.course.name}</td>
                                    <td className=" py-2 ">
                                        {item.course.requirement === 1 ? item.course.credits : 0}
                                    </td>
                                    <td className=" py-2 ">
                                        {item.course.requirement === 1 ? "x" : ""}
                                    </td>
                                    <td className=" py-2">
                                        {item.course.requirement === 0 ? "x" : ""}
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400 py-4">
                                        Không có học phần nào thuộc khối kiến thức này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

        );
    };


    return (
        <>
            {
                loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    teachingPlans.length > 0 ? (
                        <div className="flex flex-col gap-4">

                            <Link to="/admin/curriculum-framework" className="text-[var(--medium-pink2)] underline flex items-center gap-2 text-sm font-bold ">
                                <IoMdArrowBack />
                                <h1>Quay lại</h1>
                            </Link>
                            <div className="mt-5 text-lg text-center ">
                                Các khối kiến thức và số tín chỉ trong {teachingPlans[0].generalInformation.name}
                            </div>
                            {
                                parentSummary && (
                                    <TableCurriculumFramework parentSummary={parentSummary} />
                                )
                            }
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <div className=" text-2xl font-bold">Khung chương trình trống!</div>
                            <h1 className="text-base italic text-gray-500">Do chưa có kế hoạch dạy học</h1>
                            <Link to="/admin/curriculum-framework" className="text-[var(--medium-pink2)] underline flex items-center gap-2 text-sm font-bold ">
                                <IoMdArrowBack />
                                <h1>Quay lại</h1>
                            </Link>
                        </div>
                    )
                )
            }
            {
                areaId !== 0 && (
                    <TableCourseByArea areaId={areaId} teachingPlans={teachingPlans} />
                )
            }
        </>
    );
};

export default CurriculumFrameworkDetail;