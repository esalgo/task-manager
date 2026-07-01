import "./users-styles.css"

export function usersView() {

    return `
       <section class="section user-section">

            <article class="form user-article">

                <h2 class="title">Gestión de Usuarios</h2>

                <div class="message"></div>

                <form class="user-form forms" id="user-form">

                    <div class="column user-column">

                        <input hidden="hidden" class="input" id="id" name="id">

                        <label class="label" for="name">Nombre</label>
                        <input class="input" type="text" id="name" name="name" placeholder="Ingrese el nombre..." >

                         <label class="label" for="password">Contraseña</label>
                        <input class="input" type="password" id="password" name="password" placeholder="Ingrese la contraseña..." >

                    </div>

                    <div class="column user-column">

                        <label class="label" for="email">Email</label>
                        <input class="input" type="text" id="email" name="email" placeholder="Ingrese el email..." >

                        <label class="label" for="rol">Rol</label>

                        <select class="select" id="rol" name="rol">

                            <option value="Usuario" selected>Usuario</option>
                            <option value="Administrador">Administrador</option>

                        </select>

                    </div>

                    <div class="column btn-column user-column">

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
                        <th class="th">Nombre</th>
                        <th class="th">Email</th>
                        <th class="th">Rol</th>
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
