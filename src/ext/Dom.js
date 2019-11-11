const createElement = (doc, tagName, id, attrs) => {
  const element = doc.getElementsByTagName(tagName)[0]
  const lel = element
  let el = element
  if (doc.getElementById(id)) {
    return
  }
  el = doc.createElement(tagName)
  el.id = id
  for (var property in attrs) {
    if (attrs.hasOwnProperty(property)) {
      el[property] = attrs[property]
    }
  }
  lel.parentNode.insertBefore(el, lel)
}

export { createElement }
