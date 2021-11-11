import MJXSVG from './mjx-svg.js'

const m = new MJXSVG(document.getElementById('mjx-svg'), { scale: 3 })

window.m = m

m.update('x = a + p + p')

setTimeout(() => { m.update('x = a') }, 3000)
