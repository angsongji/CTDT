import { get, postWithStatus, putWithStatus, delWithStatus } from "../utils/request";

export const getAllGeneralInformation = async () => {
    const result = await get(`general-informations`);
    return result;
}

export const createGeneralInformation = async (data) => {
    const result = await postWithStatus(`general-informations`, data);
    return result;
}

export const updateGeneralInformation = async (id, data) => {
    const result = await putWithStatus("general-informations", id, data);
    console.log(result);    
    return result;
}


export const deleteGeneralInformation = async (id) => {
    const result = await delWithStatus("general-informations", id);
    return result;
};
