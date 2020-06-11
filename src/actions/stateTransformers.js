import { fromJS, merge } from 'immutable'
import { addIndex, forEach, any, map, filter, includes, find, reduce } from 'ramda'
import moment from 'moment'
import { CultureList, LogEntriesList, TaskList } from '../domain'
import { nextId } from './../domain/data'

const DEFAULT_TOTAL_SURFACE = 10

export const saveCulture = (state, cultureData) => {
  const cultureList = new CultureList(state.get('data').toJS())

  if(state.get('cultureState').get('editedCulture')) {
    cultureList.update(
      state.get('cultureState').get('editedCulture').get('id'),
      cultureData.product,
      cultureData.status,
      cultureData.plantDate,
      cultureData.surfaces)
  } else {
    cultureList.add(
      cultureData.product,
      cultureData.status,
      cultureData.plantDate,
      cultureData.surfaces)
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

  if(state.get('logState').get('editedEntry')) {
    logEntriesList.update(state.get('logState').get('editedEntry').get('id'),
      moment(logEntryData.date).format(),
      logEntryData.tags,
      logEntryData.description,
      logEntryData.linkedSurfaces,
      logEntryData.linkedPlots,
      logEntryData.linkedCultures || [])
  } else {
    logEntriesList.add(moment(logEntryData.date).format(),
      logEntryData.tags,
      logEntryData.description,
      logEntryData.linkedSurfaces,
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
      filters.push(logEntry => {
        if(!logEntry.surfaces) return false
        return any(surfaceId => find(logSurface => surfaceId === logSurface, logEntry.surfaces), searchData.surfaces)
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
      filters.push(culture => {
        return any(surfaceId => find(logSurface => surfaceId === logSurface, culture.surfaces), searchData.surfaces)
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
      filters.push(product => any(family => product.family === family, searchData.families))
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

const upgradeState = state => {
  let result = state
  const currentSchemeVersion = +state.get('data').get('settings').get('dataschemeVersion')

  if(currentSchemeVersion < 2) {
    // Give an id to every surfaces
    const surfaces = state.get('data').get('surfaces').toJS()
    const indexedSurfaces = addIndex(map)((surface, idx) => ({ ...surface, id: idx}), surfaces)

    // Ensure all references to surfaces are made to the id
    const cultures = state.get('data').get('cultures').toJS()
    forEach(culture => {
      culture.surfaces = map(cultureSurface => find(surface => surface.plot === cultureSurface.plot && surface.code === cultureSurface.code, indexedSurfaces).id, culture.surfaces)
    }, cultures)
    const logEntries = state.get('data').get('log').toJS()
    forEach(logEntry => {
      logEntry.surfaces = map(logEntrySurface => find(surface => surface.plot === logEntrySurface.plot && surface.code === logEntrySurface.code, indexedSurfaces).id, logEntry.surfaces)
    }, logEntries)

    const updatedSettings = state.get('data').get('settings').set('dataschemeVersion', '2')
    result = result.set('data', result.get('data').merge({ settings: updatedSettings, surfaces: fromJS(indexedSurfaces), cultures: fromJS(cultures), log: fromJS(logEntries) }))
  }

  if(currentSchemeVersion < 3) {
    const cultures = state.get('data').get('cultures').toJS()
    const cultureList = new CultureList(state.get('data').toJS())
    forEach(culture => {
      cultureList.recalculateTasks(culture)
    }, cultures)

    const updatedSettings = state.get('data').get('settings').set('dataschemeVersion', '3')
    result = result.set('data', result.get('data').merge({ settings: updatedSettings}).merge(fromJS(cultureList.data())))
  }

  if(currentSchemeVersion < 4) {
    const tasks = state.get('data').get('tasks').toJS()
    forEach(task => task.id = nextId(tasks), tasks)

    const updatedSettings = state.get('data').get('settings').set('dataschemeVersion', '4')
    result = result.set('data', result.get('data').merge({ settings: updatedSettings}).merge(fromJS({ tasks })))
  }

  return result
}

export const setStateRight = state => {
  let result
  if(state.get('data')) {
    const products = (state.get('data') && state.get('data').get('products') && state.get('data').get('products').toJS()) || []

    setProductCalculatedProps(products, state)

    result = state.set('data', state.get('data').set('products', fromJS(products)))
  } else {
    result = state.set('data', fromJS({ settings: { totalSurface: getTotalSurface }}))
  }
  if(!result.get('data').get('settings').get('dataschemeVersion')) {
    const currentSettings = result.get('data').get('settings')
    result = result.set('data', result.get('data').set('settings', currentSettings.set('dataschemeVersion', '1')))
  }
  result = upgradeState(result)

  return result
}

export const adoptPlan = (state) => {
  const cultureList = new CultureList(state.get('data').toJS())
  const plan = state.get('planState').get('currentPlan').toJS()
  forEach(rating => {
    cultureList.add(rating.culture.product.name, rating.culture.status, rating.culture.plantDate, map(surface => surface.id , rating.suggestions[rating.selectedSuggestionId].surfaces))
  }, plan.ratings)
  return cultureList.data()
}

export const switchCultureState = (targetStatus, cultureId, date, surfaces, remark, state) => {
  const stateData = state.get('data').toJS()
  const cultureList = new CultureList(stateData)
  const logEntriesList = new LogEntriesList(stateData)
  if(!surfaces || surfaces.length === 0) {
    cultureList.update(cultureId, null, targetStatus, null, surfaces, date)
    if(remark){
      const cultureSurfaces = find(culture => culture.id === cultureId, stateData.cultures).surfaces
      logEntriesList.add(date, ['Remarque'], remark, cultureSurfaces, [], [cultureId])
    }
  } else {
    const newCultureId = cultureList.splitByStatus(cultureId, surfaces, targetStatus, date)
    if(remark) logEntriesList.add(date, ['Remarque'], remark, surfaces, [], [newCultureId])
  }
  return state.set('data', merge(state.get('data'), fromJS(cultureList.data())))
}

export const rescheduleTask = (taskId, newDate, state) => {
  const taskList = new TaskList(state.get('data').toJS())
  taskList.reschedule(taskId, newDate)
  return state.set('data', merge(state.get('data'), fromJS({ tasks: taskList.tasks })))
}

export const addFollowUp = (state, productName, growingDays, dateBegin, dateEnd, actionType, details) => {
  const products = state.get('data').get('products').toJS()
  const product = find(product => product.name === productName, products)
  if(!product.followUp) product.followUp = []

  product.followUp.push({
    id: nextId(product.followUp),
    growingDays, dateBegin, dateEnd, actionType, details
  })

  return state.set('data', state.get('data').merge( fromJS({ products })))
}

export const updateFollowUp = (state, productName, followUpId, growingDays, dateBegin, dateEnd, actionType, details) => {
  const products = state.get('data').get('products').toJS()
  const product = find(product => product.name === productName, products)
  const followUpToUpdate = find(followUp => followUp.id === followUpId, product.followUp)

  followUpToUpdate.growingDays = growingDays
  followUpToUpdate.dateBegin = dateBegin
  followUpToUpdate.dateEnd = dateEnd
  followUpToUpdate.actionType = actionType
  followUpToUpdate.details = details

  return state.set('data', state.get('data').merge( fromJS({ products })))
}
