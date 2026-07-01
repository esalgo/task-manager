import { deleteSession } from "../../services/session.js"
import { navigateTo } from "../../router/router.js"

export async function logoutView() {
    await deleteSession()

    setTimeout(() => {
        navigateTo("/login");
    }, 0);
}
