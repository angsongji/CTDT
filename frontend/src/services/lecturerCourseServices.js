import { postWithStatus } from "../utils/request";
import { API_DOMAIN } from "../utils/request";

export const createLecturerCourse = async (dataArray) => {
    const result = await postWithStatus(`lecturer-courses`, dataArray);
    return result;
}

export const deleteLecturerCourse = async (dataArray) => {
    const response = await fetch(`${API_DOMAIN}lecturer-courses`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // BẮT BUỘC
      },
      body: JSON.stringify(dataArray), // Ví dụ: [{id: 1}, {id: 2}]
    });
  
    const result = await response.text();
    return { status: response.status, message: result };
  };
  