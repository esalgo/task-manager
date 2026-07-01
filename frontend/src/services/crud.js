import {createMessages} from "../helpers/create-messages.js";
import {checkFormEmpty} from "../helpers/utils.js";
import {getAccessToken, setAccessToken} from "./session.js";

const API_URL = "http://localhost:5001/api"

function authHeaders() {
    const token = getAccessToken()
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

async function fetchWithAuth(url, options = {}) {
    const headers = { ...authHeaders(), ...(options.headers ?? {}) }
    const res = await fetch(url, { ...options, headers, credentials: "include" })

    if (res.status !== 401) return res

    // Token expired — try to get a new one using the refresh token cookie
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    })

    if (!refreshRes.ok) return res

    const { accessToken } = await refreshRes.json()
    setAccessToken(accessToken)

    // Retry the original request with the new access token
    return fetch(url, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
        credentials: "include"
    })
}

export async function getAllData(endPoint) {
    try {
        const res = await fetchWithAuth(`${API_URL}${endPoint}`)
        if (!res.ok) return []
        return await res.json() ?? []
    } catch (error) {
        console.error(error.message)
        return []
    }
}

export async function getById(id, endPoint) {
    try {
        const res = await fetchWithAuth(`${API_URL}${endPoint}/${id}`)
        if (!res.ok) return false
        return await res.json()
    } catch (error) {
        console.error(error.message)
        return false
    }
}

export async function create(task, formId, endPoint) {
    const { id, ...taskToCreate } = task

    const checkEmpty = checkFormEmpty(taskToCreate, formId)
    if (!checkEmpty) return false

    try {
        const res = await fetchWithAuth(`${API_URL}${endPoint}`, {
            method: "POST",
            body: JSON.stringify(taskToCreate)
        })

        const response = await (res.ok ? res.json() : Promise.reject(`¡Error!, ${res.status} - ${res.statusText}`))

        if (response) {
            createMessages("¡Se ha creado con éxito!", formId, "success")
            return response
        }

        createMessages("¡No se creó!", formId, "error")
        return false

    } catch (error) {
        console.error(error.message ?? error)
        return false
    }
}

export async function updateById(objectToUpdate, formId, endPoint) {
    const checkEmpty = checkFormEmpty(objectToUpdate, formId)
    if (!checkEmpty) return false

    const request = await getById(objectToUpdate.id, endPoint)

    try {
        if (request) {
            const updateRes = await fetchWithAuth(`${API_URL}${endPoint}/${objectToUpdate.id}`, {
                method: "PUT",
                body: JSON.stringify(objectToUpdate)
            })

            const response = await (updateRes.ok ? updateRes.json() :
                Promise.reject(`Error de actualización, ${updateRes.status} - ${updateRes.statusText}`))

            if (response) {
                createMessages("¡Se actualizó correctamente!", formId, "success")
                return response
            }

            createMessages("¡Falló la actualización!", formId, "error")
        }
        return false

    } catch (error) {
        console.error(error.message ?? error)
        return false
    }
}

export async function deleteById(id, formId, endPoint) {
    const request = await getById(id, endPoint)
    if (!request) return false

    try {
        const requestDelete = await fetchWithAuth(`${API_URL}${endPoint}/${id}`, {
            method: "DELETE"
        })

        if (!requestDelete.ok) {
            createMessages("Error al eliminar", formId, "error")
            return false
        }

        createMessages("Se eliminó correctamente", formId, "success")
        return true

    } catch (error) {
        console.error(error.message)
        return false
    }
}
