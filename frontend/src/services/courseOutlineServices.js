import { get, post, patch, del } from "../utils/request";

// Lấy tất cả course outlines
export const getAll = async () => {
    const result = await get("course-outlines");
    return result;
};

// Lấy course outline theo ID
export const getById = async (id) => {
    const result = await get(`course-outlines/${id}`);
    return result;
};

// Lấy danh sách course outlines theo id_course
export const getByCourseId = async (courseId) => {
    const result = await get(`course-outlines/course/${courseId}`);
    return result;
};

// Thêm mới course outline
export const create = async (data) => {
    const result = await post("course-outlines", data);
    return result;
};

// Cập nhật course outline theo ID
export const update = async (id, data) => {
    try {
        // Chỉ gửi các trường cần thiết
        const updateData = {
            assessmentUnit: data.assessmentUnit,
            componentScore: data.componentScore,
            assessmentMethod: data.assessmentMethod,
            weight: data.weight,
            status: data.status,
            course: {
                id: data.course.id
            }
        };

        // Thêm parent nếu có
        if (data.parent) {
            updateData.parent = {
                id: data.parent.id
            };
        }

        console.log('Sending update data:', updateData);
        const result = await patch("course-outlines", id, updateData);
        console.log('Update result:', result);
        return result;
    } catch (error) {
        console.error('Error updating course outline:', error);
        throw error;
    }
};

// Xoá course outline theo ID
export const remove = async (id) => {
    const result = await del("course-outlines", id);
    return result;
};

// Xoá tất cả course outlines theo courseId
export const deleteByCourseId = async (courseId) => {
    const result = await del(`course-outlines/course/${courseId}`);
    return result;
};
