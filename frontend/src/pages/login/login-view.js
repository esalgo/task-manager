import './login-styles.css';

export function loginView() {
    return `
    <section class="section login-section">
  
         <div class="login-container">
         
            <h1 class="title">Iniciar Sesión</h1>
            
            <p class="p">Ingresa tu credenciales</p>         
            <form class="form login-form" id="login-form">
                
                <label for="email" class="label">Email</label>
                <input type="email" class="input" id="email" name="email" placeholder=" Ingrese su email ...">
                
                <label for="password" class="label">Contraseña</label>
                <input type="password" class="input" id="password" name="password" placeholder=" Ingrese su contraseña ...">
                
                <div class="message"></div>

                <button class="btn login-btn" id="login-btn" type="submit">Iniciar Sesión</button>
            
            </form>
            
            <p class="p">¿No tienes cuenta? <a class="a" href="/register">Registrate</a></p>
        
        </div>
    
    </section>
    `
}