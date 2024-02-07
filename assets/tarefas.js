// 'use strict'

// const userId = sessionStorage.getItem('userId')

// async function obterTarefas() {
//     const url = `http://127.0.0.1:5080/tarefas?id=${userId}`

//     const response = await fetch(url)
//     const tarefas = await response.json()

//     console.log(tarefas)
// }

// obterTarefas()

const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')

let minhaListaDeItens = []

function adicionarNovaTarefa() {
    minhaListaDeItens.push({
        tarefa: input.value,
        concluida: false,
    })

    input.value = ''

    mostrarTarefas()
}

function mostrarTarefas() {
    let novaLi = ''
    minhaListaDeItens.forEach((item, posicao) => {
      novaLi +=
        `<li class="task ${item.concluida ? 'done' : ''}">
          <div class="circle checked" onclick="concluirTarefa(${posicao})"></div>
          <p contenteditable="${item.editando ? 'true' : 'false'}" 
             onblur="finalizarEdicao(${posicao}, this.innerText)"
             onkeydown="verificarEnter(event, ${posicao})">${item.tarefa}</p>
          <div class="edit-container">
              <div class="circle edit" onclick="editarItem(${posicao})"></div>
              <div class="circle trash" onclick="deletarItem(${posicao})"></div>
          </div>
        </li>`
    })
    listaCompleta.innerHTML = novaLi
    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens))
  }
  
  function verificarEnter(event, posicao) {
    if (event.key === 'Enter') {
      event.preventDefault()
      finalizarEdicao(posicao, event.target.innerText)
    }
  }
  

function editarItem(posicao) {
    minhaListaDeItens = minhaListaDeItens.map((item, index) => {
        if (index === posicao) {
            return { ...item, editando: true }
        }
        return item
    })
    mostrarTarefas()
    document.querySelectorAll('.list-tasks .task p')[posicao].focus()
}

function finalizarEdicao(posicao, novoTexto) {
    minhaListaDeItens[posicao].tarefa = novoTexto
    minhaListaDeItens[posicao].editando = false
    mostrarTarefas()
}

function concluirTarefa(posicao) {
    minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida

    mostrarTarefas()
}

function deletarItem(posicao) {
    minhaListaDeItens.splice(posicao, 1)

    mostrarTarefas()
}


function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista')

    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage)
    }

    mostrarTarefas()
}

recarregarTarefas()
button.addEventListener('click', adicionarNovaTarefa)
