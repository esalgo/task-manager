import {getAllData, deleteById} from "../services/crud.js";
import {routesWithTables} from "../router/routes.js";
import {activateDisableBtn} from "./activate-disable-btn.js";

const TABLE_COLUMNS = {
    "/tasks": ["id", "title", "category", "date", "priority", "status", "description", "userId"],
    "/users": ["id", "name", "email", "rol"]
}

export function createTableElements(data, tableBody, endPoint) {

    const columns = TABLE_COLUMNS[endPoint] ?? Object.keys(data[0] ?? {})

    tableBody.innerHTML = data.map((object) => {

        let cells = columns
            .map((key) => `<td class="td">${object[key] ?? ""}</td>`)
            .join("")

        return `
            <tr class="table-row">
                ${cells}
                <td class="td td-icon"><img class="icons edit" src="src/assets/edit.png"></td>
                <td class="td td-icon"><img class="icons delete" src="src/assets/delete.png"></td>
            </tr>
        `
    }).join("")

    tableBody.querySelectorAll(".edit").forEach((editIcon) => {

        editIcon.addEventListener("click", (event) => {

            const row = event.target.closest("tr")
            const form = document.querySelector("form")

            // Match each column to its form input by the name attribute
            columns.forEach((key, colIndex) => {
                const input = form.querySelector(`[name="${key}"]`)
                if (input) input.value = row.children[colIndex].textContent
            })

            activateDisableBtn()
        })
    })

    tableBody.querySelectorAll(".delete").forEach((deleteIcon) => {

        deleteIcon.addEventListener("click", (event) => {

            let row = event.target.closest("tr")
            let idToDelete = row.firstElementChild.textContent

            let form = document.querySelector("form")
            let formId = form.getAttribute("id")
            let endPoint = location.pathname

            deleteById(idToDelete, formId, endPoint)
                .then(() => updateTables(endPoint))
                .catch((error) => {
                    console.error(error)
                })
        })
    })
}

export async function updateTables(endPoint) {

    if (routesWithTables.includes(endPoint)) {

        let tableBody = document.querySelector(".table-body")

        if (!tableBody) {
            console.warn("Tabla no encontrada, reintentando...")
            return
        }

        // The backend filters tasks by role automatically — always use getAllData
        let getData = await getAllData(endPoint)

        if (!Array.isArray(getData) || getData.length < 1) {
            tableBody.innerHTML = ""
            return "No hay datos para mostrar"
        }

        createTableElements(getData, tableBody, endPoint)
        return "Se actualizó la tabla correctamente"
    }

    return "No hay tablas para actualizar"
}
