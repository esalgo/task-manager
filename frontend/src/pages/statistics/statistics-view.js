import './statistics-styles.css'
import { getMetrics } from "../../helpers/get-metrics.js"

export async function statisticsView() {

    let metrics =  await getMetrics()

    return `
        <section class="section statistics-section">
        
           <h1 class="title">Estadísticas</h1>

            <div class="grid-container">
            
                    <div class="card">
                    
                       <h3 class="h3">Total de tareas registradas </h3>
                       <p>${metrics[0]}</p>
                       
                    </div>
                    
                    <div class="card">
                    
                       <h3 class="h3">Tareas pendientes</h3>
                       <p>${metrics[1]}</p>

                       
                    </div>
                    
                    <div class="card">
                    
                       <h3 class="h3">Tareas completadas</h3>
                       <p>${metrics[2]}</p>

                       
                    </div>
                            
                                
                    <div class="card">
                    
                       <h3 class="h3">Total de usuarios</h3>
                       <p>${metrics[3]}</p>

                       
                    </div>
                    
                   
            </div>

    </section>`

}