
import { get, post, put, del } from "../utils/request";


// Lấy danh sách tất cả khoá học
export const getAllCourses = async () => {
    const result = await get("courses");
    return result;
};

// Lấy thông tin khoá học theo ID
export const getCourseById = async (id) => {
    const result = await get(`courses/${id}`);
    return result;
};

// Thêm mới khoá học
export const createCourse = async (data) => {
    const result = await post("courses", data);
    return result;
};

// Cập nhật thông tin khoá học
export const updateCourse = async (id, data) => {
    const result = await put("courses", id, data);
    return result;
};

// Xóa khoá học
export const deleteCourse = async (id) => {
    const result = await del("courses", id);
    return result;
};

