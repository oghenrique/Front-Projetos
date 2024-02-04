'use strict'

const buttonLogin = document.getElementById('login')

async function obterDados() {
    const url = 'http://127.0.0.1:5080/usuario'
    try {
        const response = await fetch(url)
        const usuarios = await response.json()
        console.log(usuarios)
        return usuarios
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error)
    }
}

function fazerLogin() {
    obterDados().then(usuarios => {
        var emailInput = document.getElementById('user').value.trim()
        var senhaInput = document.getElementById('pass').value

        var usuarioEncontrado = usuarios.find(function(usuario) {
            return usuario.email.trim() === emailInput && usuario.senha === senhaInput
        })

        if (usuarioEncontrado) {
            sessionStorage.setItem('userId', usuarioEncontrado.id)
            window.location.href = '/html/pgHome.html'
        } else {
            alert('Usuário ou senha incorretos. Tente novamente.')
        }
    })
}



buttonLogin.addEventListener('click', fazerLogin)