import {getSession} from "../services/session.js";
import {getById} from "../services/crud.js";

export async function loadProfileForm() {
    const endPoint = location.pathname
    if (endPoint !== "/profile") return

    const ses = JSON.parse(getSession())
    if (!ses?.id) return

    const user = await getById(ses.id, "/users")
    if (!user) return

    const form = document.querySelector("#profile-form")
    if (!form) return

    form.querySelector("#id").value = user.id ?? ""
    form.querySelector("#name").value = user.name ?? ""
    form.querySelector("#email").value = user.email ?? ""
    form.querySelector("#rol").value = user.rol ?? ""
    // Password is never returned by the server — leave the field empty
}

export function setProfileInputsDisabled(disabled) {
    const endPoint = location.pathname
    if (endPoint !== "/profile") return

    const form = document.querySelector("#profile-form")
    if (!form) return

    const ses = JSON.parse(getSession())

    const nameInput = form.querySelector("#name")
    const emailInput = form.querySelector("#email")
    const passwordInput = form.querySelector("#password")

    nameInput.disabled = disabled
    passwordInput.disabled = disabled

    const canEditEmail = ses?.rol === "Administrador"
    emailInput.disabled = disabled || !canEditEmail
}
