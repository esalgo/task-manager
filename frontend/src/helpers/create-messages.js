
// It allows you to create dynamic messages in the domain.
export function createMessages(message, formId, className) {

    const element= document.getElementById(`${formId}`)
    let div = document.querySelector(".message")

    if (element) {
        div.innerHTML += `<p class="${className}">${message}</p>`
    }

    else {
        console.warn("No existe el elemento", formId)
    }

    deleteMessage(div)

}

function deleteMessage(element, ms= 3000) {

    setTimeout(()=>{
        element.innerHTML = ""
    }, ms)


}