'use strict'

const botaoSub = document.getElementById('create-account')

let usuarios = []

async function obterUsuarios() {
    const url = 'http://127.0.0.1:5080/usuario'
    const response = await fetch(url)
    usuarios = await response.json()
}

async function validarEmail(email) {
    await obterUsuarios()
    return usuarios.some(usuario => usuario.email.trim() === email)
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
            alert('Cadastro bem-sucedido!')
            window.location.href = '../index.html'
        } else {
            console.error('Erro ao cadastrar usuário no backend:', response.statusText)
            alert('Erro ao cadastrar usuário. Tente novamente.')
        }
    } catch (error) {
        console.error('Erro ao comunicar com o backend:', error)
        alert('Erro ao comunicar com o servidor. Tente novamente.')
    }
}

function obterValoresDosCampos() {
    const nome = document.getElementById('user-name').value.trim()
    const email = document.getElementById('user').value.trim()
    const senha = document.getElementById('pass').value
    const validaSenha = document.getElementById('pass-confirm').value
    const isPremium = document.getElementById("isPremium")

    let statusCheckbox = isPremium.checked

    let statusBoolean = statusCheckbox ? true : false

    if (!nome || !email || !senha || !validaSenha) {
        alert("Preencha todos os campos.")
        return
    }

    if (validaSenha !== senha) {
        alert("Senhas não coincidem.")
        return
    }

    validarEmail(email).then(emailEmUso => {
        if (emailEmUso) {
            alert("Email já está em uso.")
        } else {
            const novoUsuarioLocal = {
                nome: nome,
                email: email,
                senha: senha,
                premium: statusBoolean
            }
            enviarUsuarioParaBackend(novoUsuarioLocal)
        }
    })
}

botaoSub.addEventListener('click', obterValoresDosCampos)