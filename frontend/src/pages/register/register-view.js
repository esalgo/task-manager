import './register-styles.css'

export function registerView() {

    return `

    <section class="section register-section">
    
      <form id="register-form" class="form register-form">

            <h2 class="title">Registrar Usuario</h2>

            <div class="data-form">

                <div class="column">

                    <label class="label" for="name">Nombre</label>
                    <input class="input" type="text" id="name" name="name" placeholder="Ingrese su nombre..." >

                    <label class="label" for="password"> Contraseña </label>
                    <input class="input" type="password" id="password" name="password" placeholder="Ingrese su contraseña..." >

                </div>

                <div class="column">

                    <label class="label" for="email">Email</label>
                    <input class="input" type="email" id="email" name="email"  placeholder="Ingrese su email...">

                    <label class="label" for="password2">Repetir Contraseña</label>
                    <input class="input" type="password" id="password2" name="password2" placeholder="Repita su contraseña...">


                </div>
                
            </div>
            
            <div class="message"></div>
            
            <div class="btn-div">
            
                <button class="btn btn-register" id="btn-register" type="submit">Registrarse</button>
                <button class="btn btn-register" type="reset">Cancelar</button>
         
            </div>
            
            <p class="p">¿Tienes cuenta? <a class="a" href="/login">Inicia Sesión</a></p>


      </form>

    </section> 

    `


}