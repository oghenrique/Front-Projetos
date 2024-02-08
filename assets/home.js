'use strict'

//Background aleatorios
var backgrounds = [
    'url(../img/background.svg)',
    'url(../img/background-2.webp)',
    'url(../img/background-3.jpg)',
]

var selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

document.body.style.backgroundImage = selectedBackground;