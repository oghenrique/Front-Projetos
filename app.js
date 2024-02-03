'use strict'

var showPasswordIcon = document.getElementById('show-password')
var passwordField = document.getElementById('pass')

showPasswordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
        passwordField.type = 'text'
    } else {
        passwordField.type = 'password'
    }
    
    showPasswordIcon.classList.add('blinking')

    setTimeout(function() {
        showPasswordIcon.classList.remove('blinking')
    }, 1000)
})


//Background aleatorios
var backgrounds = [
    'url(../img/background.svg)',
    'url(../img/background-2.webp)',
    'url(../img/background-3.jpg)',
]
var selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

document.body.style.backgroundImage = selectedBackground;

  