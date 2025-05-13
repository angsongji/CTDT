
import { get, post, patch, del } from "../utils/request";

// Lấy danh sách tất cả lĩnh vực kiến thức
export const getAllKnowledgeAreas = async () => {
    const result = await get(`knowledge-areas`);
    return result;
};

// Lấy thông tin lĩnh vực kiến thức theo ID
export const getKnowledgeAreaById = async (id) => {
    const result = await get(`knowledge-areas/${id}`);
    return result;
};

// Thêm mới lĩnh vực kiến thức
export const createKnowledgeArea = async (data) => {
    const result = await post("knowledge-areas", data);
    return result;
};

// Cập nhật thông tin lĩnh vực kiến thức
export const updateKnowledgeArea = async (id, data) => {
    const result = await patch("knowledge-areas", id, data);
    return result;
};

// Xóa lĩnh vực kiến thức
export const deleteKnowledgeArea = async (id) => {
    const result = await del("knowledge-areas", id);
    return result;
};

