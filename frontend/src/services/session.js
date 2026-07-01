const SESSION_KEY = "userSesion"
const TOKEN_KEY = "accessToken"
const API_URL = "http://localhost:5001/api"

export function createSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function getSession() {
    return localStorage.getItem(SESSION_KEY)
}

export function setAccessToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function clearAccessToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export async function deleteSession() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
    } catch {
        // best-effort: even if the request fails, clear the local session
    }
    localStorage.removeItem(SESSION_KEY)
    clearAccessToken()
}
