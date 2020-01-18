import { fromJS, merge } from 'immutable'
import { forEach, any, map, filter, includes, find, reduce } from 'ramda'
import moment from 'moment'
import { nextId } from '../domain/data'

export const saveCulture = (state, cultureData) => {
  const cultures = state.get('data').get('cultures') ? state.get('data').get('cultures').toJS() : []
  const selectedSurfaces = map(selectedSurface => {
    const split = selectedSurface.value.split('ùùù')
    return {
      plot: split[0],
      code: split[1]
    }
  }, cultureData.surfaces)

  let editedCulture
  if(state.get('cultureState').get('editedCulture')) {
    editedCulture = find(culture => culture.id === state.get('cultureState').get('editedCulture').get('id'), cultures)
  } else {
    editedCulture = {
      id: nextId(cultures)
    }
    cultures.push(editedCulture)
  }

  editedCulture.productName = cultureData.product.value
  editedCulture.status = cultureData.status.value
  editedCulture.plantDate = cultureData.plantDate
  editedCulture.surfaces = selectedSurfaces

  const updatedData = merge(state.get('data'), { cultures: fromJS(cultures) })
  const cultureState = state.get('cultureState')
  return merge(state, {data: updatedData, cultureState: cultureState.set('editing', false)})
}

export const saveLogEntry = (state, logEntryData) => {
  const logEntries = state.get('data').get('log') ? state.get('data').get('log').toJS() : []
  const logTags = state.get('data').get('logTags') ? state.get('data').get('logTags').toJS() : []
  const tagsToCreate = filter(tag => !any(logTag => logTag.toLowerCase() === tag.value.toLowerCase(), logTags), logEntryData.tags)
  if(tagsToCreate.length > 0) {
    logTags.push(...map(tag => tag.value, tagsToCreate))
  }

  let logEntry
  if(state.get('logState').get('editedEntry')) {
    logEntry = find(entry => entry.id === state.get('logState').get('editedEntry').get('id'), logEntries)
  } else {
    logEntry = {
      id: nextId(logEntries)
    }
    logEntries.push(logEntry)
  }
  logEntry.date = moment(logEntryData.date).format()
  logEntry.tags = map(tag => tag.value, logEntryData.tags)
  logEntry.description = logEntryData.description
  if(logEntryData.linkedCultures) {
    logEntry.cultures = map(culture => culture.value, logEntryData.linkedCultures)
  }
  if(logEntryData.linkedSurfaces) {
    logEntry.surfaces = map(surface => {
      const split = surface.value.split('ùùù')
      const plot = split[0]
      const code = split[1]
      return { plot, code }
    }, logEntryData.linkedSurfaces)
  }

  const updatedData = merge(state.get('data'), { log: fromJS(logEntries), logTags: fromJS(logTags) })
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
  product.family = productData.family.value
  product.greediness = +productData.greediness.value
  product.productivity = +productData.productivity
  product.unit = productData.unit
  product.greenhouse = productData.greenhouse
  product.surfaceRatio = +productData.surfaceRatio
  product.sowMax = +productData.sowMax.value
  product.sowMin = +productData.sowMin.value
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
        return any(tag => includes(tag.value, logEntry.tags), searchData.tags)
      })
    }
    if(searchData.cultures && searchData.cultures.length > 0) {
      filters.push(logEntry => {
        if(!logEntry.cultures) return false
        return any(culture => includes(culture.value, logEntry.cultures), searchData.cultures)
      })
    }
    if(searchData.surfaces && searchData.surfaces.length > 0) {
      const surfacesToSearchFor = map(surface => {
        const split = surface.value.split('ùùù')
        return { plot: split[0], code: split[1] }
      }, searchData.surfaces)
      filters.push(logEntry => {
        if(!logEntry.surfaces) return false
        return any(surface => find(logSurface => surface.plot === logSurface.plot && surface.code === logSurface.code, logEntry.surfaces), surfacesToSearchFor)
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
        return any(product => product.value === culture.productName, searchData.products)
      })
    }
    if(searchData.surfaces && searchData.surfaces.length > 0) {
      const surfacesToSearchFor = map(surface => {
        const split = surface.value.split('ùùù')
        return { plot: split[0], code: split[1] }
      }, searchData.surfaces)
      filters.push(culture => {
        return any(surface => find(logSurface => surface.plot === logSurface.plot && surface.code === logSurface.code, culture.surfaces), surfacesToSearchFor)
      })
    }
    if(searchData.status) {
      filters.push(culture => {
        return culture.status === searchData.status.value
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
      filters.push(product => any(greediness => product.greediness === greediness.value, searchData.greedinesses))
    }

    if(searchData.sowMin && searchData.sowMax) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMin.value <= product.sowMax && searchData.sowMax.value >= product.sowMin
        } else {
          return searchData.sowMin.value >= product.sowMax || searchData.sowMax.value <= product.sowMin
        }
      })
    } else if(searchData.sowMin) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMin.value <= product.sowMax
        } else {
          return true
        }
      })
    } else if(searchData.sowMax) {
      filters.push(product => {
        if(product.sowMin < product.sowMax) {
          return searchData.sowMax.value >= product.sowMin
        } else {
          return true
        }
      })
    }

    if(searchData.greenhouse && searchData.greenhouse.value !== 1) {
      if(searchData.greenhouse.value === 3)
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
  const totalSurface = state.get('settings').get('totalSurface')
  const sumRatios = reduce((acc, value) => {
    return acc + value.surfaceRatio
  }, 0, products)

  forEach(product => calculateProduct(product, totalSurface, sumRatios), products)
}

export const recalculateSurfaces = state => {
  const products = state.get('data').get('products').toJS()

  setProductCalculatedProps(products, state)

  return state.set('data', state.get('data').set('products', fromJS(products)))
}

export const setStateRight = state => {
  let result
  if(!state.get('settings')) {
    result = state.set('settings', { totalSurface: 40 })
  } else {
    const totalSurface = state.get('settings').get('totalSurface')
    if(!totalSurface) result = state.set('settings', merge(state.get('settings'), { totalSurface: 40 }))
    else result = state
  }

  if(state.get('data')) {
    const products = state.get('data') ? state.get('data').get('products').toJS() || [] : []

    setProductCalculatedProps(products, result)

    return result.set('data', result.get('data').set('products', fromJS(products)))
  } else {
    return result
  }
}
