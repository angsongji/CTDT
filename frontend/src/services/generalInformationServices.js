import { get } from "../utils/request";

export const getAllGeneralInformation = async () => {
    const result = await get(`general-informations`);
    return result;
}

