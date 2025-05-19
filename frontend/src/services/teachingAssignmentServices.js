import { post, del } from "../utils/request";

export const createTeachingAssignment= async (data) => {
    const result = await post(`teaching-assignments/create`, data);
    return result;
}

export const delTeachingAssignment= async (id) => {
    const result = await del(`teaching-assignments/del`, id);
    return result;
}
