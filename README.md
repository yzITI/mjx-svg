# mjx-svg
 
SVG Animation for MathJax Tex

[Demo](https://yziti.github.io/mjx-svg/)

## Get Start

**mjx-svg** must work with loaded MathJax 3.x tex-svg

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <!-- load MathJax and mjx-svg -->
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mjx-svg@latest/dist/mjx-svg.umd.js"></script>
</head>
<body>
  <div id="mjx-svg"></div>
  <script>
    // initialize a new instance with an existing element
    const m = new MJXSVG(document.getElementById('mjx-svg'))

    // update rendered expression
    m.update('y = e^\\sqrt{x}')
  </script>
</body>
</html>
```

## Full Example

```js
// initialize instance with options
const m = new MJXSVG(null, {
  transition: 'all 0.5s ease', // transition property
  createDelay: 200 // milliseconds delay of new symbols creation
})

// render to DOM
document.body.append(m.svg)

// example
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
```
