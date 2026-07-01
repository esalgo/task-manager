import "./profile-styles.css"

export function profileView() {

    return `
       <section class="section user-section">
   
            <article class="form user-article">
    
                <h2 class="title">Mi Perfil</h2>
            
                <div class="message"></div>
                        
                <form class="user-form forms" id="profile-form">
                
                    <div class="column user-column">
                
                        <input hidden="hidden" class="input" id="id" name="id">
                    
                        <label class="label" for="name">Nombre</label>
                        <input class="input" type="text" id="name" name="name" placeholder="Ingrese el nombre..." disabled>
                    
                         <label class="label" for="password">Contraseña</label>
                        <input class="input" type="password" id="password" name="password" placeholder="Ingrese la contraseña..." disabled>
                    
                    </div>

                    <div class="column user-column">
                
                        <label class="label" for="email">Email</label>
                        <input class="input" type="text" id="email" name="email" placeholder="Ingrese el email..." disabled>
                    
                        <label class="label" for="rol">Rol</label>  
                        <input class="select" id="rol" name="rol" disabled>
                    
                    </div>

                    <div class="column btn-column user-column">
                    
                        <button class="btn btn-disabled" id="btn-save" type="submit" disabled>Guardar</button>
                        <button class="btn" id="btn-update" type="button">Actualizar</button>
                        <button class="btn" type="reset" id="btn-reset">Limpiar</button>

                    </div>
                                       
                </form>
                  
            </article>

       </section>`

}



























// import "./profile-styles.css"
//
// export function profileView() {
//
//     return `
//        <section class="section user-section">
//
//             <article class="form user-article">
//
//                 <h2 class="title">Mi Perfil</h2>
//
//                 <div class="message"></div>
//
//                 <form class="user-form forms" id="user-form">
//
//                     <div class="column user-column">
//
//                         <input hidden="hidden" class="input" id="id" name="id">
//
//                         <label class="label" for="name">Nombre</label>
//                         <input class="input" type="text" id="name" name="name" placeholder="Ingrese el nombre..." >
//
//                          <label class="label" for="password">Contraseña</label>
//                         <input class="input" type="password" id="password" name="password" placeholder="Ingrese la contraseña..." >
//
//                     </div>
//
//                     <div class="column user-column">
//
//                         <label class="label" for="email">Email</label>
//                         <input class="input" type="text" id="email" name="email" placeholder="Ingrese el email..." >
//
//                         <label class="label" for="rol">Rol</label>
//                         <input class="select" id="rol" name="rol" disabled>
//
//                     </div>
//
//                     <div class="column btn-column user-column">
//
//                         <button class="btn" id="btn-save" type="submit">Guardar</button>
//                         <button class="btn" id="btn-profile" type="button">Actualizar</button>
//                         <button class="btn" type="reset" id="btn-reset">Limpiar</button>
//
//                     </div>
//
//                 </form>
//
//             </article>
//
//        </section>`
//
// }
//
