
import { getWithStatus, postWithStatus, putWithStatus, delWithStatus } from "../utils/request";

// Lấy danh sách tất cả lĩnh vực kiến thức
export const getAllFaculties = async () => {
    const result = await getWithStatus(`faculties`);
    return result;
};

// Lấy thông tin lĩnh vực kiến thức theo ID
export const getFacultyById = async (id) => {
    const result = await get(`faculties/${id}`);
    return result;
};

// Thêm mới lĩnh vực kiến thức
export const createFaculty = async (data) => {
    const result = await postWithStatus("faculties", data);
    return result;
};

// Cập nhật thông tin lĩnh vực kiến thức
export const updateFaculty = async (id, data) => {
    const result = await putWithStatus("faculties", id, data);
    return result;
};

// Xóa lĩnh vực kiến thức
export const deleteFaculty = async (id) => {
    const result = await delWithStatus("faculties", id);
    return result;
};

