import { get, post, patch, del } from "../utils/request";

// Lấy tất cả TeachingPlans
export const getAll = async () => {
    try {
        const result = await get("teaching-plans");
        return result;
    } catch (error) {
        console.error('Error in getAll:', error);
        throw error;
    }
};

// Lấy TeachingPlan theo id_information
export const getByInformationId = async (idInformation) => {
    try {
        const result = await get(`teaching-plans/information/${idInformation}`);
        return result;
    } catch (error) {
        console.error('Error in getByInformationId:', error);
        throw error;
    }
};

// Thêm mới TeachingPlan
export const createTeachingPlan = async (data) => {
    try {
        const result = await post("teaching-plans", {
            generalInformation: { id: data.id_information },
            course: { id: data.id_course },
            implementationSemester: data.implementationSemester,
            status: data.status
        });
        return result;
    } catch (error) {
        console.error('Error in createTeachingPlan:', error);
        throw error;
    }
};

// Cập nhật TeachingPlan theo id
export const updateTeachingPlan = async (id, data) => {
    try {
        const result = await patch("teaching-plans", id, {
            generalInformation: { id: data.id_information },
            course: { id: data.id_course },
            implementationSemester: data.implementationSemester,
            status: data.status
        });
        return result;
    } catch (error) {
        console.error('Error in updateTeachingPlan:', error);
        throw error;
    }
};

// Xoá TeachingPlan theo id
export const deleteTeachingPlan = async (id) => {
    try {
        const result = await del("teaching-plans", id);
        return result;
    } catch (error) {
        console.error('Error in deleteTeachingPlan:', error);
        throw error;
    }
};
