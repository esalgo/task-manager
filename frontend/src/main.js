import './styles/globals.css'
import { navigateTo } from "./router/router.js";
import  { createUser } from "./services/register.js"
import { login } from "./services/login.js"
import {create, updateById, getById} from "./services/crud.js";
import { updateTables } from "./helpers/create-tables.js";
import { activateDisableBtn } from "./helpers/activate-disable-btn.js";
import {getSession, createSession} from "./services/session.js"
import { loadProfileForm, setProfileInputsDisabled } from "./helpers/profile-form.js"

const render = async () => {
    const pathReal = await navigateTo(location.pathname)

    if (pathReal === "/profile") {
        await loadProfileForm()
        setProfileInputsDisabled(true)
    }

}

render()


document.addEventListener("click", async (event) => {

    if (event.target.matches("#btn-reset")) {
        const form = event.target.closest("form")
        if (form) form.reset()
    }

    const link = event.target.closest("a");
    if (link) {
        const href = link.getAttribute("href");

        if (href && href.startsWith("/")) {
            event.preventDefault();
            await navigateTo(href);

            if (href === "/profile") {
                await loadProfileForm()
                setProfileInputsDisabled(true)
            }
            return;
        }
    }

    if (event.target.matches("#btn-update") && location.pathname === "/profile") {
        setProfileInputsDisabled(false)
        activateDisableBtn()
    }

    if (event.target.matches("#btn-update") && (location.pathname === "/tasks" || location.pathname === "/users")) {

        let form = document.querySelector("form")
        let formId = form.getAttribute("id")
        let endPoint = location.pathname

        let dataToUpdate = {}
        let elements = [...form.elements]

        elements.forEach(element => {
            if (element.name) { dataToUpdate[element.name] = element.value }
        })

        if (endPoint === "/tasks") {
            dataToUpdate.userId = JSON.parse(getSession()).id
        }

        // For user updates, an empty password field means "do not change it"
        if (endPoint === "/users" && !dataToUpdate.password) {
            delete dataToUpdate.password
        }

        await updateById(dataToUpdate, formId, endPoint)
        await updateTables(endPoint)

        activateDisableBtn()

        form.reset()
    }

})

document.addEventListener("submit", async (event) => {

    event.preventDefault()

    let formId = event.target.getAttribute("id")
    let form = event.target
    let formData = new FormData(form)
    let data = Object.fromEntries(formData)
    let session = JSON.parse(getSession())

    if (formId === "register-form") {
        await createUser(data, formId)
        form.reset()
    }

    if (formId === "login-form") {
        await login(data, formId)
        form.reset()
    }

    if (formId === "task-form") {

        data.userId = session.id

        await create(data, formId, "/tasks")

        let endPoint = location.pathname
        await updateTables(endPoint)

        form.reset()
    }

    if (formId === "profile-form") {

        const ses = JSON.parse(getSession())
        if (!ses?.id) return

        const isAdmin = ses.rol === "Administrador"

        // Build a minimal update payload — only include fields the user can change
        const payload = {
            id: ses.id,
            name: data.name,
            ...(isAdmin && data.email ? { email: data.email } : {}),
            ...(data.password ? { password: data.password } : {})
        }

        const updated = await updateById(payload, formId, "/users")

        if (updated) {
            createSession({
                id: updated.id,
                email: updated.email,
                name: updated.name,
                rol: updated.rol
            })
        }

        setProfileInputsDisabled(true)
        activateDisableBtn()
        await loadProfileForm()
        return
    }

    if (formId === "user-form" && location.pathname === "/users") {
        await create(data, formId, "/users")

        let endPoint = location.pathname
        await updateTables(endPoint)

        form.reset()

    }

})

document.addEventListener('popstate', async (e) => {
    await navigateTo(location.pathname)
    history.pushState(null, null, location.pathname)
})
