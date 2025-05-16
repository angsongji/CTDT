import { postWithStatus } from "../utils/request";


export const createLecturerCourse = async (dataArray) => {
    const result = await postWithStatus(`lecturer-courses`, dataArray);
    return result;
}