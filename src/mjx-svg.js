let serialNum = 0
const serial = () => String(serialNum++)

function parsePaths (defs) {
  const res = {}
  for (const path of defs.children) res[path.id.replace(/MJX-\d*?-/, '')] = path.attributes.d.value
  return res
}

function parseAST (node, res) {
  const attr = a => node.attributes[a]?.value
  const n = { name: node.nodeName, transform: [0, 0, 1] }
  if (n.name == 'rect') {
    n.type = 'rect'
    n.attributes = { width: attr('width'), height: attr('height'), x: attr('x'), y: attr('y') }
  }
  if (n.name == 'use') {
    n.type = attr('xlink:href').replace(/#MJX-\d*?-/, '')
    n.attributes = { pathId: res.type }
  }
  if (n.name == 'g') {
    n.mml = attr('data-mml-node')
  }
  const transform = attr('transform')
  if (transform) {
    const translate = transform.match(/translate\((.*?),(.*?)\)/)
    const scale = transform.match(/scale\((.*?)\)/)
    if (translate) {
      n.transform[0] = Number(translate[1])
      n.transform[1] += Number(translate[2])
    }
    if (scale) n.transform[2] = Number(scale[1])
  }
  n.children = []
  for (const c of node.children) n.children.push(parseAST(c, res))
  const id = serial()
  res[id] = n
  return id
}

function parseLeaves (id, AST, leaves, transform = [0, 0, 1]) {
  const node = AST[id]
  const newTransform = [transform[0] + node.transform[0]*transform[2], transform[1] + node.transform[1]*transform[2], transform[2]*node.transform[2]]
  if (!node.children.length) {
    leaves[id] = { name: node.name, type: node.type, mml: node.mml, attributes: node.attributes, transform: newTransform }
  }
  for (const c of node.children) parseLeaves(c, AST, leaves, newTransform)
}

export default class {
  constructor (el, options = {}) {
    this.options = {
      transition: options.transition || 'all 0.5s ease',
      createDelay: options.createDelay || 200,
      removeDelay: options.removeDelay || 1000,
      scale: options.scale || 1
    }
    this.paths = {}
    this.AST = {}
    this.leaves = []
    this.svg = this.getSVG('')
    const w = this.svg.attributes.width.value, h = this.svg.attributes.height.value
    this.svg.removeAttribute('width')
    this.svg.removeAttribute('height')
    this.svg.style.width = w
    this.svg.style.height = h
    this.svg.style.overflow = 'visible'
    // remove rubbish
    this.svg.removeChild(this.svg.firstChild)
    this.svg.firstChild.removeChild(this.svg.firstChild.firstChild)
    if (el && el.replaceWith) el.replaceWith(this.svg)
  }
  async update (tex) {
    const svg = this.getSVG(tex), root = svg.children[1]
    this.svg.style.width = svg.attributes.width.value
    this.svg.style.height = svg.attributes.height.value
    this.svg.style.verticalAlign = svg.style.verticalAlign
    this.svg.setAttribute('viewBox', svg.attributes.viewBox.value)

    this.paths = parsePaths(svg.children[0])
    const AST = {}, leaves = {} // new AST and leaves
    const rootId = parseAST(root.children[0], AST)
    parseLeaves(rootId, AST, leaves)

    this.render(AST, leaves)

    this.AST = AST
  }
  getSVG (tex) {
    return MathJax.tex2svg(tex, { scale: 3 }).children[0]
  }
  updateElement (leaf) {
    if (leaf.name == 'use') {
      leaf.element.style.d = `path("${this.paths[leaf.attributes.pathId]}")`
    }
    if (leaf.name == 'rect') {
      leaf.element.style.width = leaf.attributes.width + 'px'
      leaf.element.style.height = leaf.attributes.height + 'px'
      leaf.element.style.x = leaf.attributes.x + 'px'
      leaf.element.style.y = leaf.attributes.y + 'px'
    }
    leaf.element.style.transform = `translate(${leaf.transform[0]}px, ${leaf.transform[1]}px) scale(${leaf.transform[2]})`
  }
  createElement (leaf) {
    if (leaf.name == 'use') {
      leaf.element = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    }
    if (leaf.name == 'rect') {
      leaf.element = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
    }
    leaf.element.style.transition = this.options.transition
    leaf.element.style.opacity = 0
    setTimeout(() => { leaf.element.style.opacity = 1 }, this.options.createDelay)
    this.updateElement(leaf)
  }
  render (AST, leaves) {
    const types = {}
    // get types of old leaves
    for (const l of this.leaves) {
      if (!types[l.type]) types[l.type] = []
      types[l.type].push(l)
      l.deprecating = true
    }
    // loop over new leaves
    for (const l of leaves) {
      if (types[l.type] && types[l.type].length) { // reuse
        const leaf = types[l.type].shift()
        leaf.deprecating = false
        leaf.attributes = l.attributes
        leaf.transform = l.transform
        this.updateElement(leaf)
      } else { // create new leaf
        this.createElement(l)
        this.leaves.push(l)
        this.svg.firstChild.appendChild(l.element)
      }
    }
    // remove deprecated
    for (const l of this.leaves) {
      if (l.deprecating) {
        l.element.style.opacity = 0
        setTimeout(() => { this.svg.firstChild.removeChild(l.element) }, this.options.removeDelay)
      }
    }
    this.leaves = this.leaves.filter(x => !x.deprecating)
  }
}
