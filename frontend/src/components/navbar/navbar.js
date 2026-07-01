import './navbar-styles.css'
import { getSession } from "../../services/session.js"

export function navbar() {

    return `
        <nav class="navbar">
            <a class="a navbars" href="/login">Inicio Sesión</a>
            <a class="a navbars" data-link  href="/register">Registrarse</a>
        
        </nav>
       `
}

export function userNavbar() {

    let sesion = JSON.parse(getSession())

    return `
    
        <nav class="navbar">
        
            <a class="a navbars" href="/home">Dashboard</a>
            <a class="a navbars" data-link  href="/tasks">Tareas</a>
            <a class="a navbars" data-link  href="/logout">Cerrar Sesión</a>
            <p class="p"> <strong class="strong">Rol  ${sesion.rol}</strong> </p>
    
        </nav>
    `
}

export function adminNavbar() {

    let sesion = JSON.parse(getSession("userSesion"))

    return `
    
        <nav class="navbar">
        
            <a class="a navbars" href="/home">Dashboard</a>
            <a class="a navbars" data-link  href="/tasks">Tareas</a>
            <a class="a navbars" data-link  href="/users">Usuarios</a>
            <a class="a navbars" data-link  href="/logout">Cerrar Sesión</a>
            <p class="p"> <strong class="strong">Rol  ${sesion.rol}</strong> </p>

        </nav>
    `

}