import {routes, adminRoutes, usersRoutes, routesWithTables} from './routes.js'
import {navbar, userNavbar, adminNavbar} from "../components/navbar/navbar.js";
import { getSession } from "../services/session.js";
import {updateTables} from "../helpers/create-tables.js";

/**
 * Handles SPA navigation by updating the DOM without reloading the page.
 * @param {string} path - The URL path to navigate to.
 */
export async function navigateTo(path) {

    const nav = document.getElementById('header')
    const app = document.getElementById('app')

    let session = JSON.parse(getSession())

    let view;

    // Check if user is logged in to determine Navbar and Access Rights
    if (session) {
        nav.innerHTML = session.rol === "Usuario" ? userNavbar() : adminNavbar()

        // Role-based route protection
        if (session.rol === "Usuario" && usersRoutes[path]) {
            view = usersRoutes[path]

        } else if (session.rol === "Administrador" && adminRoutes[path]) {
            view = adminRoutes[path]

        } else {

            // Default redirect for authenticated users
            path = '/home'
            view = usersRoutes['/home']
        }

    } else {

        // Public routes for non-authenticated users
        nav.innerHTML = navbar()
        if (routes[path]) {
            view = routes[path]
        } else {
            path = '/login'
            view = routes['/login']
        }
    }
    // Update browser history
    history.pushState(null, null, path)

    // Render the selected view into the main container
    if (view) {
        app.innerHTML = await view()

        if (routesWithTables.includes(path)) {
            await updateTables(path)
        }
    }
    return path

}
