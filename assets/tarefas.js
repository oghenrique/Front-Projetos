'use strict'

const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')
let minhaListaDeItens = []
const userId = sessionStorage.getItem('userId')
// console.log('UserID:', userId)

async function obterTarefas() {
    const userId = sessionStorage.getItem('userId');
    console.log('UserID:', userId);

    const url = `http://127.0.0.1:5080/tarefas?idUsuario=${userId}`;

    try {
        const response = await fetch(url);
        const tarefasResponse = await response.json();

        if (tarefasResponse && Array.isArray(tarefasResponse)) {
            minhaListaDeItens = tarefasResponse
                .filter(tarefa => tarefa.idUsuario == userId)
                .map(tarefa => ({
                    id: tarefa.id,
                    tarefa: tarefa.descricao || tarefa.tarefa,
                    concluida: tarefa.concluida || false
                }));
        } else {
            console.error('Resposta da API inválida:', tarefasResponse);
        }

        mostrarTarefas();
    } catch (error) {
        console.error('Erro ao obter tarefas:', error);
    }
}


async function adicionarNovaTarefa() {
    const userId = sessionStorage.getItem('userId')
    const novaTarefa = {
        tarefa: input.value,
        concluida: false,
        idUsuario: userId
    }

    try {
        const response = await fetch('http://127.0.0.1:5080/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTarefa)
        })

        if (!response.ok) {
            throw new Error('Erro ao adicionar nova tarefa')
        }

        const tarefaCriada = await response.json()
        novaTarefa.id = tarefaCriada.id
        minhaListaDeItens.push(novaTarefa)
        input.value = ''
        mostrarTarefas()
    } catch (error) {
        console.error('Erro ao adicionar nova tarefa:', error)
    }
}

async function finalizarEdicao(posicao, novoTexto, idTarefa) {
    const userId = sessionStorage.getItem('userId')
    const tarefaAtualizada = {
        id: idTarefa,
        tarefa: novoTexto,
        concluida: minhaListaDeItens[posicao].concluida,
        idUsuario: userId
    }

    try {
        const response = await fetch(`http://127.0.0.1:5080/tarefas/${idTarefa}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefaAtualizada)
        })

        if (!response.ok) {
            throw new Error('Erro ao atualizar tarefa')
        }

        // Atualiza a tarefa na lista local
        minhaListaDeItens[posicao].tarefa = novoTexto

        mostrarTarefas()
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error)
    }
}


function mostrarTarefas() {
    let novaLi = ''
    minhaListaDeItens.forEach((item, posicao) => {
        const idTarefa = item.id
        novaLi +=
            `<li class="task ${item.concluida ? 'done' : ''}">
          <div class="circle checked" onclick="concluirTarefa(${posicao}, ${idTarefa})"></div>
          <p contenteditable="${item.editando ? 'true' : 'false'}" 
             onblur="finalizarEdicao(${posicao}, this.innerText, ${idTarefa})"
             onkeydown="verificarEnter(event, ${posicao}, ${idTarefa})">${item.tarefa}</p>
          <div class="edit-container">
              <div class="circle edit" onclick="editarItem(${posicao}, ${idTarefa})"></div>
              <div class="circle trash" onclick="deletarItem(${idTarefa})"></div> 
          </div>
        </li>`
    })
    listaCompleta.innerHTML = novaLi
    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens))
}

function editarItem(posicao, idTarefa) {
    minhaListaDeItens[posicao].editando = true
    mostrarTarefas() // Atualiza a interface para habilitar a edição
}

function verificarEnter(event, posicao, idTarefa) {
    if (event.key === 'Enter') {
        event.preventDefault()
        finalizarEdicao(posicao, event.target.innerText, idTarefa)
    }
}

async function concluirTarefa(posicao, idTarefa) {
    const userId = sessionStorage.getItem('userId')
    const tarefaConcluida = {
        ...minhaListaDeItens[posicao],
        concluida: !minhaListaDeItens[posicao].concluida,
        idUsuario: userId
    }

    try {
        const response = await fetch(`http://127.0.0.1:5080/tarefas/${idTarefa}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefaConcluida)
        })

        if (!response.ok) {
            throw new Error('Erro ao concluir tarefa')
        }

        // Atualiza a tarefa na lista local
        minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida

        mostrarTarefas()
    } catch (error) {
        console.error('Erro ao concluir tarefa:', error)
    }
}


async function deletarItem(idTarefa) {
    try {
        const response = await fetch(`http://127.0.0.1:5080/tarefas/${idTarefa}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error('Erro ao deletar tarefa')
        }

        minhaListaDeItens = minhaListaDeItens.filter(item => item.id !== idTarefa)
        mostrarTarefas()
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
    }
}

async function recarregarTarefas() {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
        await obterTarefas() // Chama a função para buscar as tarefas do servidor
    } else {
        console.error('ID do usuário não encontrado no sessionStorage')
    }
}


recarregarTarefas()
button.addEventListener('click', adicionarNovaTarefa)
