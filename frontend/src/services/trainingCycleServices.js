import { get, post } from "../utils/request";

export const getAllTraningCycle = async () => {
    const result = await get(`training-cycles`);
    return result;
}


export const createTraningCycle = async (data) => {
    const result = await post(`training-cycles/create`, data);
    return result;
}