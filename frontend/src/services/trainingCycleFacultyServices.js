import { get, post, patch, del } from "../utils/request";

export const getAllTraningCycleFaculties = async () => {
    const result = await get(`training-cycles-faculty`);
    return result;
}

export const createTraningCycleFaculty = async (data) => {
    const result = await post(`training-cycles-faculty/create`, data);
    return result;
}

export const patchTraningCycleFaculty = async (id, data) => {
    const result = await patch(`training-cycles-faculty/edit`,id, data);
    return result;
}

export const getFacultyByTrainingCycle = async (id) => {
    const result = await get(`training-cycles-faculty/detail/${id}`);
    return result;
}

export const delFacultyTrainingCycle = async (id) => {
    const result = await del(`training-cycles-faculty/delete`, id);
    return result;
}