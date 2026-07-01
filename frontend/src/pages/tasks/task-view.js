import "./task-styles.css"

export function taskView() {
    return `
        <section class="section task-section">
            
        <article class="form task-article">
        
            <h2 class="title">Gestionar Tareas</h2>
            
            <div class="message"></div>
                        
            <form class="forms task-form" id="task-form">
                
                <div class="column">
               
                    <input hidden="hidden" class="input" id="id" name="id">
                    
                    <label class="label" for="title">Título tarea</label>
                    <input class="input" type="text" id="title" name="title" placeholder=" Ingrese el titulo de la tarea..." >
                    
                    <label class="label" for="category">Categoría</label>
                    <input class="input" type="text" id="category" name="category" placeholder=" Ingrese la categoría de la tarea..." >
                    
                    <label class="label" for="date">Fecha</label>
                    <input class="input" min="2026-02-03" type="date" id="date" name="date" placeholder=" Ingrese la fecha..." >

                                                                        
                </div>    
                
                <div class="column">
                
                
                    <label class="label" for="priority">Prioridad</label>
                    <select class="select" id="priority" name="priority">
                        <option hidden="hidden" style="font-weight: bold;">Seleccione la prioridad</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                        
                    </select>       
                
                    <label class="label" for="status">Estatus</label>
                    <select class="select" id="status" name="status">
                        <option hidden="hidden" style="font-weight: bold;">Seleccione el estatus</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Progreso">Progreso</option>
                        <option value="Completada">Completada</option>
                    </select>    
                
             
                    <label class="label" for="description">Descripción de la tarea</label>
                    <textarea class="textarea" id="description" name="description" placeholder=" Ingrese la descripción..." > </textarea>
                    
                    
                </div>
                
                <div class="column btn-column">
                    <button class="btn" id="btn-save" type="submit">Guardar</button>
                    <button class="btn btn-disabled" id="btn-update" type="button" disabled>Actualizar</button>
                    <button class="btn" type="reset" id="btn-reset">Limpiar</button>

                </div>
                
            </form>
                  
        </article>
        
        
        <article class="table-article">
            <table class="table">
            
                <thead class="table-head">
                
                    <tr class="row">
                        <th class="th">Id</th>
                        <th class="th">Título</th>
                        <th class="th">Categoría</th>
                        <th class="th">Fecha</th>
                        <th class="th">Prioridad</th>
                        <th class="th">Estatus</th>
                        <th class="th">Descripción</th>
                        <th class="th">Id Usuario</th>
                        <th class="th">Editar</th>
                        <th class="th">Eliminar</th>
                    </tr>
                
                </thead>
                
                <tbody class="table-body">
                
                                
                </tbody>
                
            </table>
        
        </article>
                    
            
        
        </section>
    `
}