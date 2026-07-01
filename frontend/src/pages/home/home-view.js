import './home-styles.css'
import { getSession } from "../../services/session.js"
import { panelAdmin, panelUser} from "../../components/dashboard/panel-component.js";

export function homeView() {

    let sesion = JSON.parse(getSession())

    let panelHome = sesion.rol === "Usuario" ? panelUser() : panelAdmin();

    return `
        <section class="section home-section">
            <h1 class="title">Dashboard</h1>
            
            <h2 class="subtitle"> Bienvenido ${sesion.name} </h2>
            
            ${panelHome}
        
        </section>    
    `
}