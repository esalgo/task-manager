import {createMessages} from "../helpers/create-messages.js";
import {checkFormEmpty} from "../helpers/utils.js";
import {createSession, setAccessToken} from "./session.js";
import {navigateTo} from "../router/router.js";

const API_URL = "http://localhost:5001/api"

export async function login(user, formId) {

    const checkEmpty = checkFormEmpty(user, formId);
    if (!checkEmpty) return false;

    try {
        const request = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, password: user.password }),
            credentials: "include"
        });

        if (!request.ok) {
            createMessages("¡Las credenciales son incorrectas!", formId, "error");
            return false;
        }

        const json = await request.json();
        setAccessToken(json.accessToken);
        createSession(json.user);
        await navigateTo("/home");
        return json.user.email;

    } catch (error) {
        console.error("Ha ocurrido un error", error.message);
        return false;
    }
}
