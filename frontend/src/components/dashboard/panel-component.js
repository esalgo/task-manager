import './panel-styles.css'

// panel components
export function panelUser() {
    return `
            <div class="grid-container">
                <div class="card">
                   <h3 class="h3">Gestionar mis Tareas</h3>
                   <button class="btn btn-card"> <a href="/tasks" data-link class="btn-card">Ir a tareas</a> </button>
                </div>
                
                <div class="card">
                   <h3 class="h3">Mi Perfil</h3>
                   <button class="btn btn-card"> <a href="/profile" data-link class="btn-card">Ir a perfil</a> </button>
                </div>

            </div>
    `
}

// admin panel components
export function panelAdmin() {
    return `
            <div class="grid-container">
                <div class="card">
                   <h3 class="h3">Gestionar usuarios</h3>
                   <button class="btn btn-card"><a href="/users" data-link class="btn-card">Ir a usuarios</a></button>

                </div>
                
                <div class="card">
                   <h3 class="h3">Gestionar Tareas</h3>
                   
                   <button class="btn btn-card"> <a href="/tasks" data-link class="btn-card">Ir a tareas</a> </button>
                </div>
                
                <div class="card">
                   <h3 class="h3">Estadísticas</h3>
                   
                   <button class="btn btn-card"> <a href="/statistics" data-link class="btn-card">Ir a Estadísticas</a> </button>
                </div>

            </div>
    `
}

