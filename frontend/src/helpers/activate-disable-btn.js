
// It allows you to activate and deactivate buttons on forms.

export function activateDisableBtn() {
    const btnSave = document.querySelector("#btn-save")
    const btnUpdate = document.querySelector("#btn-update")


    btnUpdate.disabled = !btnUpdate.disabled
    btnSave.disabled = !btnSave.disabled


    btnSave.classList.toggle("btn-disabled");
    btnUpdate.classList.toggle("btn-disabled");


}