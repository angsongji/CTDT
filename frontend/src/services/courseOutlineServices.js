import { get, post, put} from "../utils/request";

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
	const result = await put("course-outlines", id, data);
	return result;
};

// Xoá course outline theo ID
export const remove = async (id) => {
    const result = await put("course-outlines/delete", id);
    return result;
};

// Xoá tất cả course outlines theo courseId
export const deleteByCourseId = async (courseId) => {
    const result = await put("course-outlines/course/delete", courseId);
    return result;
};
