import { get } from "../utils/request";

export const getLecturerById = async (id) => {
    const result = await get(`lecturers/${id}`);
    return result;
}

export const getAllLecturers = async () => {
    const result = await get(`lecturers`);
    return result;
}