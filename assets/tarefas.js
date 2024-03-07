'use strict'

const button = document.querySelector('.button-add-task')
const input = document.querySelector('.input-task')
const listaCompleta = document.querySelector('.list-tasks')
let minhaListaDeItens = []
const userId = sessionStorage.getItem('userId')
const userPremium = sessionStorage.getItem('isPremium')

async function obterTarefas() {

    console.log('UserID:', userId)

    const url = `http://127.0.0.1:5080/tarefas?idUsuario=${userId}`

    try {
        const response = await fetch(url)
        const tarefasResponse = await response.json()

        if (tarefasResponse && Array.isArray(tarefasResponse)) {
            minhaListaDeItens = tarefasResponse
                .filter(tarefa => tarefa.idUsuario == userId)
                .map(tarefa => ({
                    id: tarefa.id,
                    tarefa: tarefa.descricao || tarefa.tarefa,
                    concluida: tarefa.concluida || false
                }))
        } else {
            console.error('Resposta da API inválida:', tarefasResponse)
        }

        mostrarTarefas()
    } catch (error) {
        console.error('Erro ao obter tarefas:', error)
    }
}

async function adicionarNovaTarefa() {


    // const isPublic = document.getElementById("isPublic")

    // let statusCheckbox = isPublic.checked

    // let statusBoolean = statusCheckbox ? true : false

    console.log(userPremium)

    if (userPremium === 'false') {
        alert("O usuário não é premium")
    } else {
        const novaTarefa = {
            tarefa: input.value,
            concluida: false,
            idUsuario: userId,
            // status: statusBoolean
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
    // Crear un fragmento para mejorar el rendimiento al agregar múltiples elementos al DOM
    const fragmento = document.createDocumentFragment();

    minhaListaDeItens.forEach((item, posicao) => {
        const li = document.createElement('li');
        li.classList.add('task');
        if (item.concluida) {
            li.classList.add('done');
        }

        const editContainer = document.createElement('div');
        editContainer.classList.add('edit-container');

        const checkedCircle = document.createElement('div');
        checkedCircle.classList.add('circle', 'checked');
        checkedCircle.onclick = () => concluirTarefa(posicao, item.id);
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fa-solid', 'fa-check');
        checkedCircle.appendChild(checkIcon);
        editContainer.appendChild(checkedCircle);

        const commentCircle = document.createElement('div');
        commentCircle.classList.add('circle', 'comment');
        commentCircle.onclick = () => mostrarModalComentario(item.tarefa.replace("'", "\\'"));
        const commentIcon = document.createElement('i');
        commentIcon.classList.add('fa-solid', 'fa-comment-dots');
        commentCircle.appendChild(commentIcon);
        editContainer.appendChild(commentCircle);

        const p = document.createElement('p');
        p.contentEditable = item.editando ? 'true' : 'false';
        p.textContent = item.tarefa;
        p.onblur = () => finalizarEdicao(posicao, p.innerText, item.id);
        p.onkeydown = (event) => verificarEnter(event, posicao, item.id);

        const editContainer2 = document.createElement('div');
        editContainer2.classList.add('edit-container');

        const editCircle = document.createElement('div');
        editCircle.classList.add('circle', 'edit');
        editCircle.onclick = () => editarItem(posicao, item.id);
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pen');
        editCircle.appendChild(editIcon);
        editContainer2.appendChild(editCircle);

        const trashCircle = document.createElement('div');
        trashCircle.classList.add('circle', 'trash');
        trashCircle.onclick = () => deletarItem(item.id);
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash');
        trashCircle.appendChild(trashIcon);
        editContainer2.appendChild(trashCircle);

        li.appendChild(editContainer);
        li.appendChild(p);
        li.appendChild(editContainer2);

        fragmento.appendChild(li);
    });

    // Limpiar el contenido anterior de listaCompleta
    while (listaCompleta.firstChild) {
        listaCompleta.removeChild(listaCompleta.firstChild);
    }

    // Agregar el fragmento al DOM
    listaCompleta.appendChild(fragmento);

    // No necesitas guardar la lista en el localStorage aquí, ya que la actualización del DOM no afecta la lista de elementos
}



function mostrarModalComentario(nomeDaTarefa) {

    var myModal = new bootstrap.Modal(document.getElementById('modalComentario'), {
        keyboard: false
    })
    document.getElementById('modalComentarioLabel').innerText = nomeDaTarefa
    myModal.show()

}


function editarItem(posicao, idTarefa) {
    minhaListaDeItens[posicao].editando = true
    mostrarTarefas()
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
        await obterTarefas()
    } else {
        console.error('ID do usuário não encontrado no sessionStorage')
    }
}


recarregarTarefas()
button.addEventListener('click', adicionarNovaTarefa)