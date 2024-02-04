'use strict'

const botaoSub = document.getElementById('create-account')

let proximoId = 1
const usuarios = []

function obterValoresDosCampos() {
    const nome = document.getElementById('user-name').value.trim()
    const email = document.getElementById('user').value.trim()
    const senha = document.getElementById('pass').value
    const validaSenha = document.getElementById('pass-confirm').value

    if (validaSenha !== senha) {
        alert("Senha Inválida")
        return;
    }

    if (usuarios.some(usuario => usuario.email === email)) {
        alert("Email já está em uso.")
        return
    }

    const novoUsuarioLocal = cadastrarUsuario(nome, email, senha)
    enviarUsuarioParaBackend(novoUsuarioLocal)
}

async function enviarUsuarioParaBackend(usuarioLocal) {
    const url = 'http://127.0.0.1:5080/usuario'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioLocal),
        })

        if (response.ok) {
            const usuarioDoBackend = await response.json()
            console.log('Usuário cadastrado com sucesso no backend:', usuarioDoBackend)
            window.location.href = '../index.html'
        } else {
            console.error('Erro ao cadastrar usuário no backend:', response.statusText)
        }
    } catch (error) {
        console.error('Erro ao comunicar com o backend:', error)
    }
}


function cadastrarUsuario(nome, email, senha) {

    const novoUsuarioLocal = {
        nome: nome,
        email: email,
        senha: senha
    }

    usuarios.push(novoUsuarioLocal)

    return novoUsuarioLocal
}

botaoSub.addEventListener('click', obterValoresDosCampos)