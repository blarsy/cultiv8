import { fromJS, merge } from 'immutable'
import { forEach, any, map, filter, includes, find, reduce } from 'ramda'
import moment from 'moment'
import { CultureList, LogEntriesList } from '../domain'

const DEFAULT_TOTAL_SURFACE = 10

export const saveCulture = (state, cultureData) => {
  const cultureList = new CultureList(state.get('data').toJS())
  const selectedSurfaces = map(selectedSurface => {
    const split = selectedSurface.split('ùùù')
    return {
      plot: split[0],
      code: split[1]
    }
  }, cultureData.surfaces)

  if(state.get('cultureState').get('editedCulture')) {
    cultureList.update(
      state.get('cultureState').get('editedCulture').get('id'),
      cultureData.product,
      cultureData.status,
      cultureData.plantDate,
      selectedSurfaces)
  } else {
    cultureList.add(
      cultureData.product,
      cultureData.status,
      cultureData.plantDate,
      selectedSurfaces)
  }

  const updatedData = merge(state.get('data'), fromJS(cultureList.data()))
  const cultureState = state.get('cultureState')
  return merge(state, {data: updatedData, cultureState: cultureState.set('editing', false)})
}

export const removeCulture = (state, cultureId) => {
  const cultureList = new CultureList(state.get('data').toJS())
  cultureList.remove(cultureId)
  const updatedData = merge(state.get('data'), fromJS(cultureList.data()))
  return merge(state, { data: updatedData})
}

export const saveLogEntry = (state, logEntryData) => {
  const logEntriesList = new LogEntriesList(state.get('data').toJS())
  const surfaces = map(surface => {
    const split = surface.split('ùùù')
    const plot = split[0]
    const code = split[1]
    return { plot, code }
  }, logEntryData.linkedSurfaces)

  if(state.get('logState').get('editedEntry')) {
    logEntriesList.update(state.get('logState').get('editedEntry').get('id'),
      moment(logEntryData.date).format(),
      logEntryData.tags,
      logEntryData.description, surfaces,
      logEntryData.linkedPlots,
      logEntryData.linkedCultures || [])
  } else {
    logEntriesList.add(moment(logEntryData.date).format(),
      logEntryData.tags,
      logEntryData.description, surfaces,
      logEntryData.linkedPlots,
      logEntryData.linkedCultures || [])
  }

  const updatedData = merge(state.get('data'), fromJS({ log: logEntriesList.log, logTags: logEntriesList.logTags }))
  const logState = state.get('logState')
  return merge(state, { data: updatedData, logState: logState.set('editing', false) })
}

export const saveProduct = (state, productData) => {
  const products = state.get('data').get('products') ? state.get('data').get('products').toJS() : []

  let product
  if(state.get('productState').get('editedProduct')) {
    const productName = state.get('productState').get('editedProduct').get('name')
    product = find(product => product.name === productName, products)
  } else {
    product = {}
    products.push(product)
  }
  product.name = productData.name
  product.family = productData.family
  product.greediness = +productData.greediness
  product.productivity = +productData.productivity
  product.unit = productData.unit
  product.greenhouse = productData.greenhouse
  product.surfaceRatio = +productData.surfaceRatio
  product.sowMax = +productData.sowMax
  product.sowMin = +productData.sowMin
  product.growingDays = +productData.growingDays
  product.nurseryDays = +productData.nurseryDays
  product.harvestDays = +productData.harvestDays
  product.workPerSqMeter = +productData.workPerSqMeter
  product.plantsPerSqMeter = +productData.plantsPerSqMeter
  product.priceOrganic = +productData.priceOrganic
  product.actualPrice = +productData.actualPrice

  setProductCalculatedProps(products, state)

  const updatedData = merge(state.get('data'), { products: fromJS(products)})
  const productState = state.get('productState')
  return merge(state, { data: updatedData, productState: productState.set('editing', false) })
}

export const searchLog = (state, searchData) => {
  if(!searchData) searchData = (state.get('logState') && state.get('logState').get('lastSearchData') ? state.get('logState').get('lastSearchData').toJS() : {})

  let result = []
  if(state.get('data').get('log')) {
    const filters = []
    if(searchData.tags && searchData.tags.length > 0) {
      filters.push(logEntry => {
        if(!logEntry.tags) return false
        return any(tag => includes(tag, logEntry.tags), searchData.tags)
      })
    }
    if(searchData.cultures && searchData.cultures.length > 0) {
      filters.push(logEntry => {
        if(!logEntry.cultures) return false
        return any(culture => includes(culture, logEntry.cultures), searchData.cultures)
      })
    }
    if(searchData.surfaces && searchData.surfaces.length > 0) {
      const surfacesToSearchFor = map(surface => {
        const split = surface.split('ùùù')
        return { plot: split[0], code: split[1] }
      }, searchData.surfaces)
      filters.push(logEntry => {
        if(!logEntry.surfaces) return false
        return any(surface => find(logSurface => surface.plot === logSurface.plot && surface.code === logSurface.code, logEntry.surfaces), surfacesToSearchFor)
      })
    }
    if(searchData.plots && searchData.plots.length > 0) {
      filters.push(logEntry => {
        if(!logEntry.plots) return false
        return any(plot => includes(plot, logEntry.plots), searchData.plots)
      })
    }
    if(searchData.description) {
      filters.push(logEntry => logEntry.description.toLowerCase().includes(searchData.description.toLowerCase()))
    }
    if(searchData.fromDate && searchData.tillDate) {
      filters.push(logEntry => {
        return moment(logEntry.date) <= moment(searchData.tillDate) && moment(logEntry.date) >= moment(searchData.fromDate)
      })
    } else if(searchData.fromDate) {
      filters.push(logEntry => {
        return moment(logEntry.date) >= moment(searchData.fromDate)
      })
    } else if(searchData.tillDate) {
      filters.push(logEntry => {
        return moment(logEntry.date) <= moment(searchData.tillDate)
      })
    }
    result = reduce((entries, filterFunc) => filter(filterFunc, entries), state.get('data').get('log').toJS(), filters)
  }
  const logState = state.get('logState').set('lastSearchResult', fromJS(result)).set('lastSearchData', fromJS(searchData))

  return state.set('logState', logState)
}

export const searchCulture = (state, searchData) => {
  if(!searchData) searchData = (state.get('cultureState') && state.get('cultureState').get('lastSearchData') ? state.get('cultureState').get('lastSearchData').toJS() : {})

  let result = []
  if(state.get('data').get('cultures')) {
    const filters = []
    if(searchData.products && searchData.products.length > 0) {
      filters.push(culture => {
        return any(product => product === culture.productName, searchData.products)
      })
    }
    if(searchData.surfaces && searchData.surfaces.length > 0) {
      const surfacesToSearchFor = map(surface => {
        const split = surface.split('ùùù')
        return { plot: split[0], code: split[1] }
      }, searchData.surfaces)
      filters.push(culture => {
        return any(surface => find(logSurface => surface.plot === logSurface.plot && surface.code === logSurface.code, culture.surfaces), surfacesToSearchFor)
      })
    }
    if(searchData.status) {
      filters.push(culture => {
        return culture.status === searchData.status
      })
    }
    if(searchData.fromDate && searchData.tillDate) {
      filters.push(culture => {
        return moment(culture.plantDate) <= moment(searchData.tillDate) && moment(culture.plantDate) >= moment(searchData.fromDate)
      })
    } else if(searchData.fromDate) {
      filters.push(culture => {
        return moment(culture.plantDate) >= moment(searchData.fromDate)
      })
    } else if(searchData.tillDate) {
      filters.push(culture => {
        return moment(culture.plantDate) <= moment(searchData.tillDate)
      })
    }
    result = reduce((entries, filterFunc) => filter(filterFunc, entries), state.get('data').get('cultures').toJS(), filters)
  }
  const cultureState = state.get('cultureState').set('lastSearchResult', fromJS(result)).set('lastSearchData', fromJS(searchData))

  return state.set('cultureState', cultureState)
}

export const searchProduct = (state, searchData) => {
  if(!searchData) searchData = (state.get('productState') && state.get('productState').get('lastSearchData') ? state.get('productState').get('lastSearchData').toJS() : {})

  let result = []
  if(state.get('data').get('products')) {
    const filters = []

    if(searchData.name) {
      filters.push(product => product.name.toLowerCase().includes(searchData.name.toLowerCase()))
    }

    if(searchData.families && searchData.families.length) {
      filters.push(product => any(family => product.family === family.label, searchData.families))
    }

    if(searchData.greedinesses && searchData.greedinesses.length) {
      filters.push(product => any(greediness => product.greediness === greediness, searchData.greedinesses))
    }

    if(searchData.sowMin && searchData.sowMax) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMin <= product.sowMax && searchData.sowMax >= product.sowMin
        } else {
          return searchData.sowMin >= product.sowMax || searchData.sowMax <= product.sowMin
        }
      })
    } else if(searchData.sowMin) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMin <= product.sowMax
        } else {
          return true
        }
      })
    } else if(searchData.sowMax) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMax >= product.sowMin
        } else {
          return true
        }
      })
    }

    if(searchData.greenhouse && searchData.greenhouse !== 1) {
      if(searchData.greenhouse === 3)
        filters.push(product => product.greenhouse === 'O')
      else
        filters.push(product => product.greenhouse !== 'O')
    }

    result = reduce((entries, filterFunc) => filter(filterFunc, entries), state.get('data').get('products').toJS(), filters)
  }

  const productState = state.get('productState').set('lastSearchResult', fromJS(result)).set('lastSearchData', fromJS(searchData))
  return state.set('productState', productState)
}

export const calculateProduct = (product, totalSurface, sumRatios) => {
  product.surface = (+product.surfaceRatio / sumRatios) * totalSurface * 100
  product.totalNumberOfPlants = product.surface * +product.plantsPerSqMeter
  product.greenhouseSurface = product.greenhouse ? product.surface : 0
  product.incomePerSqMeter = +product.productivity * +product.actualPrice
  product.totalIncome = product.incomePerSqMeter * product.surface
  product.incomePerWorkHour = product.incomePerSqMeter / (+product.workPerSqMeter / 60)
  product.soilOccupationRatio = (365 - (+product.growingDays - +product.nurseryDays + +product.harvestDays))/(365 / 5)
  if(product.soilOccupationRatio < 0) product.soilOccupationRatio = 0.1
  product.amountOfWorkRatio = (300 - +product.workPerSqMeter)/60
  product.interestRatio = product.incomePerWorkHour * product.soilOccupationRatio * product.amountOfWorkRatio
}

const setProductCalculatedProps = (products, state) => {
  const totalSurface = getTotalSurface(state)
  const sumRatios = reduce((acc, value) => {
    return acc + value.surfaceRatio
  }, 0, products)

  forEach(product => calculateProduct(product, totalSurface, sumRatios), products)
}

export const getTotalSurface = state => {
  return (state.get('data') && state.get('data').get('settings') && state.get('data').get('settings').get('totalSurface')) || DEFAULT_TOTAL_SURFACE
}

export const recalculateSurfaces = state => {
  const products = (state.get('data') && state.get('data').get('products') && state.get('data').get('products').toJS()) || []

  setProductCalculatedProps(products, state)

  return state.set('data', state.get('data').set('products', fromJS(products)))
}

export const setStateRight = state => {
  if(state.get('data')) {
    const products = (state.get('data') && state.get('data').get('products') && state.get('data').get('products').toJS()) || []

    setProductCalculatedProps(products, state)

    return state.set('data', state.get('data').set('products', fromJS(products)))
  } else {
    return state.set('data', fromJS({ settings: { totalSurface: getTotalSurface }}))
  }
}

export const adoptPlan = (state) => {
  const cultureList = new CultureList(state.get('data').toJS())
  const plan = state.get('planState').get('currentPlan').toJS()
  forEach(rating => {
    cultureList.add(rating.culture.product.name, rating.culture.status, rating.culture.plantDate, rating.suggestions[rating.selectedSuggestionId].surfaces)
  }, plan.ratings)
  return cultureList.data()
}
