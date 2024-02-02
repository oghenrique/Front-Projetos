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