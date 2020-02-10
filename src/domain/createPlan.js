import {
  filter, forEachObjIndexed, forEach,
  find, sort,
  map, take, reverse,
  reduce, clone, max,
  addIndex
} from 'ramda'
import { getNextRange, surfaceIsAvailableInPeriod, assignCulturesToSurfaces } from './planner'
import { nextId } from './data'

// Standard unit of surfaces is 10 square meters
const STANDARD_SURFACE = 10
const SURFACE_UNAVAILABLE = -1

const rateSurface = (surface, targetCulture) => {
  let familyAdequateness = 100
  let greedinessAdequateness = 100
  if(surface.cultures && surface.cultures.length > 0) {
    let i = 0
    while(i < surface.cultures.length && surface.cultures[i].product.family !== targetCulture.product.family) {
      i ++
    }
    if(i < 5) familyAdequateness = i * 20
    const targetGreediness = targetCulture.product.greediness
    const previousGreediness = surface.cultures[0].product.greediness
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
    return {
      family: 100,
      greediness: 100
    }
  }
  return {
    family: familyAdequateness,
    greediness: greedinessAdequateness
  }
}

const createSuggestions = (contiguousSurfacesRatings, nbSuggestions, targetCulture) => {
  const nbSurfaces = Math.round(targetCulture.targetSurface / STANDARD_SURFACE)
  let nbPerfectMatches = 0
  const contiguousSets = []
  // First collect contiguous sets of surfaces
  forEach(contiguousSurfacesRating => {
    if(contiguousSurfacesRating.length >= nbSurfaces) {
      for(let i = 0; i < contiguousSurfacesRating.length - nbSurfaces + 1; i ++){
        const currentSet = { score: 0, maxScore: 0 , surfaces: [] }
        for(let j = i; j < nbSurfaces + i; j ++) {
          currentSet.surfaces.push(contiguousSurfacesRating[j].surface)
          currentSet.score += contiguousSurfacesRating[j].score.family + contiguousSurfacesRating[j].score.greediness
          currentSet.maxScore += 200
        }
        contiguousSets.push(currentSet)
        if(currentSet.score / nbSurfaces === 200) nbPerfectMatches ++
      }
    }
  }, contiguousSurfacesRatings)

  let splitSets = []
  // ... then, unless enough perfect matches were found, collect split sets of surfaces
  if(nbPerfectMatches < nbSuggestions && contiguousSurfacesRatings.length > 1) {
    const collectSplitSets = (contiguousSurfacesRatings, maxNbSurfaces) => {
      const result = []
      const currentSurfaceRating = contiguousSurfacesRatings[0]

      let reducedContiguousSurfaces = []
      if(contiguousSurfacesRatings.length > 1) reducedContiguousSurfaces = take(contiguousSurfacesRatings.length - 1, contiguousSurfacesRatings)

      for(let i = 0; i < maxNbSurfaces; i ++) {
        const currentSet=take(i, currentSurfaceRating)
        const currentReverseSet=take(i, reverse(currentSurfaceRating))
        if(i + 1 < maxNbSurfaces) {
          const recursiveResults = collectSplitSets(reducedContiguousSurfaces, maxNbSurfaces - i - 1)
          forEach(recursiveResult => {
            result.push({
              nbSets: recursiveResult.nbSets + 1,
              surfaces: currentSet.concat(recursiveResult.surfaces)
            })
            result.push({
              nbSets: recursiveResult.nbSets + 1,
              surfaces: currentReverseSet.concat(recursiveResult.surfaces)
            })
          }, recursiveResults)
        }
        result.push({
          nbSets: 1,
          surfaces: currentSet
        })
      }
      return result
    }

    splitSets = addIndex(map)((possibleSet, idx) => ({
      score: reduce((acc, surfaceRating) => acc + surfaceRating.score, 0, possibleSet.surfaces) / possibleSet.nbSets,
      maxScore: reduce((acc, surfaceRating) => acc + 200),
      surfaces: possibleSet.surfaces
    }), collectSplitSets(contiguousSurfacesRatings))

  }

  // return the highest scoring sets, according to the priorities
  return addIndex(map)((set, idx) => ({ score: set.score, maxScore: set.maxScore, surfaces: set.surfaces, id: idx }) ,take(nbSuggestions, sort((a, b) => b.score - a.score, contiguousSets.concat(splitSets))))
}

const createdSuggestedCultures = (data, ratings) => {
  const targetRatings = filter(rating => rating.selectedSuggestionId, ratings)
  forEach(rating => {
    const cultureToAdd = {
      id: nextId(data.cultures),
      status: rating.culture.status,
      plantDate: rating.culture.plantDate,
      productName: rating.name,
      surfaces: rating.suggestions[rating.selectedSuggestionId].surfaces
    }
    data.cultures.push(cultureToAdd)
  }, targetRatings)
}

const sortFnUsingPrio = (field, order) => {
  const interestSortFn = (cultA, cultB) => cultB.product.interestRatio - cultA.product.interestRatio
  if(!field) return interestSortFn

  switch(field) {
    case 'plantDate':
      return (cultA, cultB) => {
        const today = new Date(new Date().setHours(0,0,0,0))
        const rangeA = getNextRange(cultA.product, today)
        const rangeB = getNextRange(cultB.product, today)
        const sortValue = +rangeA.plantBetween.min - +rangeB.plantBetween.min
        if(sortValue === 0) return interestSortFn(cultA, cultB)
        return sortValue
      }
    case 'greediness':
      if(order === 'asc') {
        return (cultA, cultB) => {
          const sortValue = +cultB.product.greediness - +cultA.product.greediness
          if(sortValue === 0) return interestSortFn(cultA, cultB)
          return sortValue
        }
      } else {
        return (cultA, cultB) => {
          const sortValue = +cultB.product.greediness + +cultA.product.greediness
          if(sortValue === 0) return interestSortFn(cultA, cultB)
          return sortValue
        }
      }
    case 'family':
      return (cultA, cultB) => {
        const sortValue = cultB.product.family.localeCompare(cultA.product.family)
        if(sortValue === 0) return interestSortFn(cultA, cultB)
        return sortValue
      }
    default:
      return interestSortFn
  }
}

export default input => {
  //Collect surfaces from target plot
  //Use a deep clone of the surfaces array, as we will assume the best suggestions
  //are actually applied, but we don't want this to actually modify the source data
  const rawData = clone(input.data)
  const currentPlanRatings = input.planState.currentPlan ? input.planState.currentPlan.ratings : []
  createdSuggestedCultures(rawData, currentPlanRatings)
  assignCulturesToSurfaces(rawData)
  const surfaces = filter(surface => surface.plot === input.planState.selectedPlot, clone(rawData.surfaces))

  //Collect selected products
  const selections = []
  forEachObjIndexed((selection, name) => {
    if(selection.selected)
      selections.push({ name, surface: selection.surface })
    }, input.planState.selections)

  const sortPrioData = input.planState.selectedPriority ? input.planState.selectedPriority.split('_') : ['', '']
  const cultures = sort(sortFnUsingPrio(...sortPrioData),
    map(selection => ({
      targetSurface: selection.surface,
      product: find(product => product.name === selection.name, input.data.products) }),
    selections))

  //For each product ordered by interest, rate each surface for suitable-ness
  const ratings=[]

  forEach(culture => {
    let rating
    const ratingWithSuggestion = find(rating => rating.name === culture.product.name && rating.selectedSuggestionId, currentPlanRatings)
    if(ratingWithSuggestion) {
      rating = ratingWithSuggestion
    } else {
      const dates = getNextRange(culture.product, new Date())
      //Rate every surfaces, also marking those unavailable at the target culture period
      const surfaceRatings = map(surface => ({
        surface,
        score: surfaceIsAvailableInPeriod(surface, dates) ? rateSurface(surface, culture) : SURFACE_UNAVAILABLE
      }), surfaces)

      //Isolate available surfaces by contiguous sets
      const contiguousSurfacesRatings = []
      let i = -1
      let accumulating = false
      forEach(surfaceRating => {
        if(surfaceRating.score !== SURFACE_UNAVAILABLE) {
          if(!accumulating) {
            accumulating = true
            contiguousSurfacesRatings.push([])
            i++
          }
          contiguousSurfacesRatings[i].push(surfaceRating)
        } else {
          accumulating = false
        }
      }, surfaceRatings)

      //Create suggestions
      const suggestions = createSuggestions(contiguousSurfacesRatings, 5, culture)

      //Save suggestions & ratings
      rating = {
        name: culture.product.name,
        dates,
        suggestions
      }

      if(suggestions.length > 0) {
        //Consider the best suggestion is applied (so that subsequent products are
        //suggested surfaces without collisions)
        const plantDate = max(new Date(new Date().setHours(0,0,0,0)), dates.plantBetween.min)
        const cultureToSuggest = {
          product: culture.product,
          status: 0,
          plantDate
        }
        rating.culture = cultureToSuggest
        rating.selectedSuggestionId = suggestions[0].id
        forEach(surface => {
          if(!surface.cultures) surface.cultures = []
          surface.cultures.push(cultureToSuggest)
        }, suggestions[0].surfaces)
      }
    }

    ratings.push(rating)
  }, cultures)
  const result = {
    ratings,
    surfaces
  }
  if(input.planState.currentPlan) {
    result.currentRating = input.planState.currentPlan.currentRating
  }

  return result
}
