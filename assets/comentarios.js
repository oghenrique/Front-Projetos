'use strict'

const inputName = document.getElementById('inputTitulo')
const textComment = document.getElementById('inputText')
const form = document.getElementById('formulario')
const commentPost = document.getElementById('commentPost')

form.addEventListener('submit', (event) =>{
    event.preventDefault()

    let p = document.createElement('p')
    p.classList = 'p-2 d-flex text-wrap flex-wrap'
    p.innerHTML = `<strong>${inputTitulo.value}: </strong> &nbsp${textComment.value}`
    
    commentPost.appendChild(p)
    inputTitulo.value = ""
    textComment.value = ""

    inputTitulo.focus()

    
})

