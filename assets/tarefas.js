'use strict'

const userId = sessionStorage.getItem('userId')

console.log('ID do usuário logado:', userId)

async function obterTarefas() {
    const url = `http://127.0.0.1:5080/tarefas?id=${userId}`

    const response = await fetch(url)
    const tarefas = await response.json()

    console.log(tarefas)
}

obterTarefas()