import { get, post, patch } from "../utils/request";

export const getAllTraningCycle = async () => {
    const result = await get(`training-cycles`);
    return result;
}

export const createTraningCycle = async (data) => {
    const result = await post(`training-cycles/create`, data);
    return result;
}

export const patchTraningCycle = async (id, data) => {
    const result = await patch(`training-cycles/edit`,id, data);
    return result;
}

export const getTraningCycleById = async (id) => {
    const result = await get(`training-cycles/detail/${id}`);
    return result;
}