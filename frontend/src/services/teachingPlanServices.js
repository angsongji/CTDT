import { get, post, put, del } from "../utils/request";

// Lấy tất cả TeachingPlans
export const getAll = async () => {

	const result = await get("teaching-plans");
	return result;
};

// Lấy TeachingPlan theo id_information
export const getByInformationId = async (idInformation) => {
	const result = await get(`teaching-plans/information/${idInformation}`);
	return result;
};

// Thêm mới TeachingPlan
export const createTeachingPlan = async (data) => {
	const result = await post("teaching-plans", data);
	return result;
};

// Cập nhật TeachingPlan theo id
export const updateTeachingPlan = async (id, data) => {
	const result = await put("teaching-plans", id, data);
	return result;
};

// Xoá TeachingPlan theo id
export const deleteTeachingPlan = async (id) => {
	const result = await del("teaching-plans", id);
	return result;
};
