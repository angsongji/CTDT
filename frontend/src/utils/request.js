const API_DOMAIN = `http://localhost:8081/api/`;

export const get = async (path) => {
    const responsive = await fetch(API_DOMAIN + path);
    const result = await responsive.json();
    return result;
}

export const post = async (path, options) => {
    const responsive = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers:{
            Accept: "application/json",
           "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })
    const result = await responsive.json();
    return result;
}

export const patch = async (path, id , options) => {
    const responsive = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })
    const result = await responsive.json();
    return result;
}

export const del = async (path, id) => {
    const response = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "DELETE"
    });
    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Lỗi parse JSON:", error);
        return null;
    }
};


export const getWithStatus = async (path) => {
    const responsive = await fetch(API_DOMAIN + path);
    const result = await responsive.json();
    return {data: result, status: responsive.status};
}


export const putWithStatus = async (path, id , options) => {
    const responsive = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })
    const result = await responsive.json();
    console.log(result);
    return {data: result, status: responsive.status};
}

export const postWithStatus = async (path, options) => {
    const responsive = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers:{
            Accept: "application/json",
           "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })
    const result = await responsive.json();
    console.log(result);
    return {data: result, status: responsive.status};
}


export const delWithStatus = async (path, id) => {
    const responsive = await fetch(`${API_DOMAIN}${path}/${id}`,{
        method: "DELETE"
    })
    const result = await responsive.text();
    return {status: responsive.status, message: result};
}