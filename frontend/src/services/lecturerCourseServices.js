import { get, postWithStatus } from "../utils/request";


export const createLecturerCourse = async (dataArray) => {
    const result = await postWithStatus(`lecturer-courses`, dataArray);
    return result;
}


export const getLecturerCoursesByCourseId = async(idCourse) => {
	const result = await get(`lecturer-courses?courseId=${idCourse}`)
	return result;
}

export const getLecturerCourses = async() => {
	const result = await get(`lecturer-courses`)
	return result;
}