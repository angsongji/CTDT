import { post } from "../utils/request";

export const createTeachingAssignment= async (data) => {
    const result = await post(`teaching-assignments/create`, data);
    return result;
}
