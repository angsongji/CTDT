import { post, patch } from "../utils/request";

export const createGroup = async (data) => {
    const result = await post(`group-study/create`, data);
    return result;
}

export const editGroup = async (id, data) => {
    const result = await patch(`group-study/edit`,id, data);
    return result;
}