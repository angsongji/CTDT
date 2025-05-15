import { get, post, patch } from "../utils/request";

export const getAllGroupOpenPlan = async () => {
    const result = await get(`group-open-plan`);
    return result;
}

export const createGroupOpenPlan = async (data) => {
    const result = await post(`group-open-plan/create`, data);
    return result;
}

export const editGroupOpenPlan = async (id, data) => {
    const result = await patch(`group-open-plan/edit`,id, data);
    return result;
}

export const getGroupOpenPlanById = async (id) => {
    const result = await get(`group-open-plan/detail/${id}`);
    return result;
}