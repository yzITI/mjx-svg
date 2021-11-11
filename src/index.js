import MJXSVG from './mjx-svg.js'

const m = new MJXSVG(document.getElementById('mjx-svg'), { scale: 3 })

window.m = m

const sleep = ms => new Promise(r => setTimeout(r, ms))
async function show () {
  m.update('dy = d(e^{x^2})')
  await sleep(2000)
  m.update('dy = e^{x^2}d(x^2)')
  await sleep(2000)
  m.update('dy = e^{x^2}2xdx')
  await sleep(2000)
  m.update('\\frac{dy}{dx} = 2xe^{x^2}')
}
show()
