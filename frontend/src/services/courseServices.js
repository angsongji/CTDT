import { get } from "../utils/request";

export const getAllCourses = async () => {
    const result = await get(`courses`);
    return result;
}
