import { filter, forEachObjIndexed, forEach, find, sort, map } from 'ramda'
// Standard unit of surfaces is 10 square meters
const STANDARD_SURFACE = 10

const rateSurface = (surface, targetCulture) => {
  let familyAdequateness = 100
  let greedinessAdequateness = 100
  if(surface.cultures && surface.cultures.length > 0) {
    let i = 1
    while(surface.cultures[i].family !== targetCulture.product.family) {
      i ++
    }
    if(i < 5) familyAdequateness = i * 20
    const targetGreediness = targetCulture.product.greediness
    const previousGreediness = surface.cultures[0].greediness
    switch(targetGreediness) {
      case 3:
        switch (previousGreediness) {
          case 3:
            greedinessAdequateness = 50
            break
          case 2:
            greedinessAdequateness = 0
            break
          case 1:
            greedinessAdequateness = 100
            break
          default:
        }
      break
      case 2:
        switch (previousGreediness) {
          case 3:
            greedinessAdequateness = 100
            break
          case 2:
            greedinessAdequateness = 50
            break
          case 1:
            greedinessAdequateness = 50
            break
          default:
        }
      break
      case 1:
        switch (previousGreediness) {
          case 3:
            greedinessAdequateness = 50
            break
          case 2:
            greedinessAdequateness = 100
            break
          case 1:
            greedinessAdequateness = 50
            break
          default:
        }
      break
      default:
    }
  } else {
    //Max adequateness from a previously cultivated surface is 200, make surfaces
    //with no past culture slightly favored
    return 201
  }
  return familyAdequateness + greedinessAdequateness
}

const createSuggestions = (surfaceRatings, nbSuggestions, targetCulture) {
  const nbSurfaces = Math.round(targetCulture.targetSurface / STANDARD_SURFACE)
  // Determine what surfaces are available
  // by marking those occupied by a culture in the target timeperiod
  // ... and those already selected by previous cultures processed in this plan
  const
  const availableSurfaces = filter(surfaceRating => , surfaceRatings)
}

const getNextRange(product) {
  const today = new Date()
  const curMonth = today.getMonth()
  const targetYear = culture.product.sowMax - 1 < curMonth ? today.getYear() : today.getYear() + 1
  const plantDateLate = new Date(1, curMonth, 1) + product.nurseryDays
  const plantDateSoon =
  return {

  }
}

const surfaceIsAvailableInPeriod(surface, dates) {

}

export default input => {
  //Collect surfaces from target plot
  const surfaces = filter(surface => surface.plot === input.planState.selectedPlot, input.data.surfaces)

  //Collect selected products
  const selections = []
  forEachObjIndexed((selection, name) => selections.push({ name, selected: selection.selected, surface: selection.surface }), input.planState.selections)
  const selectedProducts = filter(selection => selection.selected, selections)

  const cultures = sort((cultA, cultB) => cultA.product.interestRatio - cultB.product.interestRatio,
    map(product => ({
      targetSurface: selectedProducts.surface,
      product: find(selection => product.name === selection.name, input.data.products) }),
    selectedProducts))

  //For each product ordered by interest, rate each surface for suitable-ness
  const ratings=[]
  forEach(culture => {
    const dates = getNextRange(culture.product)
    const availableSurfaces = filter(surface => surfaceIsAvailableInPeriod(surface, dates), surfaces)
    const surfaceRatings = map(surface => ({ surface, score: rateSurface(surface, culture)}), availableSurfaces)
    const suggestions = createSuggestions(surfaceRatings, 5, culture)
    const rating = {
      name: culture.product.name,
      surfacesRatings,
      suggestions
    }
    ratings.push(rating)
  }, cultures)
  return ratings
}
