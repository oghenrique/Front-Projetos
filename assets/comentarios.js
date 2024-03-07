'use strict'

const inputName = document.getElementById('inputTitulo')
const textComment = document.getElementById('inputText')
const form = document.getElementById('formulario')
const commentPost = document.getElementById('commentPost')
const idTarefas = sessionStorage.getItem('idTarefas')

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputName = document.getElementById('inputTitulo');
    const textComment = document.getElementById('inputText');
    const commentPost = document.getElementById('commentPost');

    adicionarComentario(inputName.value, textComment.value, idTarefas);

    inputName.value = "";
    textComment.value = "";

    inputName.focus();
});

function adicionarComentario(nome, comentario, idTarefas) {
    let p = document.createElement('p')
    p.classList = 'p-2 d-flex text-wrap flex-wrap'
    p.id = 'comentario'
    p.innerHTML = `<strong>${nome}: </strong> &nbsp${comentario} &nbsp${idTarefas}`

    commentPost.appendChild(p)
    console.log('ID da Tarefa:', idTarefas);
}