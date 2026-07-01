import {createMessages} from "./create-messages.js";

export function checkFormEmpty(object, formId){

    if (object instanceof Object) {

        for (let [key, value] of Object.entries(object)) {

            if (value == null || String(value).trim().length === 0) {

                createMessages("¡No pueden quedar campos vacios!", formId, "error")
                return false
            }
        }
    } return true
}

export function checkUserPassword(user, formId) {

    const hasWhitespace = /\s/;

    if (hasWhitespace.test(user.password)) {
        createMessages("¡La contraseña no puede contener espacios!", formId, "error");
        return false;
    }

    if (user.password !== user.password2) {
        createMessages("¡Las contraseñas son incorrectas!", formId, "error");
        return false;
    }

    if (String(user.password).trim().length <= 4 ) {
        createMessages("¡La contraseña es muy corta!", formId, "error");
        return false;
    }

    return true;

}
