import {createMessages} from "../helpers/create-messages.js";
import {checkFormEmpty, checkUserPassword} from "../helpers/utils.js";

const API_URL = "http://localhost:5001/api"

export async function createUser(user, formId) {

    const checkEmpty = checkFormEmpty(user, formId);
    if (!checkEmpty) return false;

    const passwordOk = checkUserPassword(user, formId);
    if (!passwordOk) return false;

    const { password2, ...userData } = user;

    try {
        const request = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: userData.name, email: userData.email, password: userData.password })
        });

        if (request.status === 409) {
            createMessages("¡El usuario ya existe!", formId, "error");
            return false;
        }

        if (!request.ok) {
            createMessages("Ha ocurrido un error al crear el usuario", formId, "error");
            return false;
        }

        createMessages("¡Se ha creado correctamente!", formId, "success");
        return await request.json();

    } catch (error) {
        console.error(error);
        createMessages("Ha ocurrido un error", formId, "error");
        return false;
    }
}
