import { get, delWithStatus, postWithStatus, putWithStatus } from "../utils/request";

export const getLecturerById = async (id) => {
    const result = await get(`lecturers/${id}`);
    return result;
}

export const getAllLecturers = async () => {
    const result = await get(`lecturers`);
    return result;
}

export const deleteLecturer = async (id) => {
    const result = await delWithStatus(`lecturers`, id);
    return result;
}

export const createLecturer = async (data) => {
    const result = await postWithStatus(`lecturers`, data);
    return result;
}

export const updateLecturer = async (id, data) => {
    const result = await putWithStatus(`lecturers`, id, data);
    return result;
}