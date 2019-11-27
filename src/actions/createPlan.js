import { filter, forEachObjIndexed, any } from 'ramda'

export default input => {
  //Collect surfaces from target plot
  const surfaces = filter(surface => surface.plot === input.planState.selectedPlot, input.data.surfaces)

  //Collect selected products
  const selectedProducts = []
  forEachObjIndexed((selection, name) => selectedProducts.push({ name, selected: selection.selected }), input.planState.selections)
  const selectedProductsName = filter(selection => selection.selected, selectedProducts)
  const products = filter(product => any(selection => selection.name === product.name, selectedProductsName), input.data.products)

  //For each product, rate each surface for suitable-ness

  //For each product, ordered by interest ratio, pick the best surfaces, and mark them as unavailable for subsequent products
  return []
}
