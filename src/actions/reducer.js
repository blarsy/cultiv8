import { Map, fromJS, mergeDeep, merge } from 'immutable'
import { forEach, forEachObjIndexed, any, map, filter, includes, find, reduce } from 'ramda'
import moment from 'moment'
import fileDownload from 'js-file-download'
import createPlan from '../domain/createPlan'
import { nextId } from '../domain/data'

const persistedState = localStorage.getItem('state')
const blankState = fromJS({
  groundsState: {
    displayDate: moment(new Date())
  },
  cultureState: {
    editing: false
  },
  logState: {
    editing: false
  }
})
const initialState = persistedState ?
  fromJS(JSON.parse(persistedState)):
  blankState

const MakeBlankPlanState = products => {
  const selections = {}
  forEach(product => selections[product.name]={ surface: product.surface, selected: false }, products)
  return Map({ selectedPlot: null, selections: fromJS(selections), allSelected: false })
}

const saveCulture = (state, cultureData) => {
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

const saveLogEntry = (state, logEntryData) => {
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

const downloadSavedData = data => {
  forEach(surface => delete surface.cultures, data.surfaces)
  fileDownload(JSON.stringify(data), `cultiv8Data-${moment().format('YYYYMMDD-HHmmss')}.json`)
}

const searchLog = (state, searchData) => {
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
      filters.push(logEntry => logEntry.description.toLowerCase().includes(searchData.description))
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

const searchCulture = (state, searchData) => {
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

export default (state = initialState, action) => {
  let result = state
  switch (action.type) {
    case 'IMPORTFILE_SELECTED':
      result = state.set('uploading', true)
      break
    case 'IMPORTFILE_FAILED':
      result = state.set('uploading', false)
      break
    case 'IMPORTFILE_UPLOADED':
      result = blankState
        .set('data', fromJS(action.data))
        .set('tasks', fromJS(action.tasks))
        .set('planState', MakeBlankPlanState(action.data.products))
      break
    case 'PLANMAKE_TOGGLEALLPRODUCTS':
      const currentSelections = state.get('planState').get('selections').toJS()
      const currentAllSelected = state.get('planState').get('allSelected')
      forEachObjIndexed(selection => {
        selection.selected = !currentAllSelected
      } , currentSelections)
      result = state.set('planState', Map(fromJS({ selections: currentSelections, allSelected: !currentAllSelected })))
      break
    case 'PLANMAKE_TOGGLEPRODUCT':
      const currentSelections1 = state.get('planState').get('selections').toJS()
      forEachObjIndexed((selection,name) => {
        if(name === action.name) {
          selection.selected = !selection.selected
        }
      } , currentSelections1)
      result = state.set('planState', state.get('planState').set('selections', fromJS(currentSelections1)))
      break
    case 'PLANMAKE_SETPRODUCTSURFACE':
      const currentSelections2 = state.get('planState').get('selections').toJS()
      forEachObjIndexed((selection,name) => {
        if(name === action.name) {
          selection.surface = +action.surface
        }
      } , currentSelections2)
      result = state.set('planState', state.get('planState').set('selections', fromJS(currentSelections2)))
      break
    case 'PLANMAKE_SUGGEST':
      result = state.set('planState', state.get('planState').set('currentPlan', fromJS(createPlan(state.toJS())).set('currentRating', 0)))
      break
    case 'PLANMAKE_SETSELECTEDPLOT':
      result = state.set('planState',state.get('planState').set('selectedPlot', action.plot))
      break
    case 'RESET_PLAN':
      result = state.set('planState', MakeBlankPlanState(action.data.get('products').toJS()))
      break
    case 'SELECT_RATING':
      const currentPlan = state.get('planState').get('currentPlan').set('currentRating', action.rating)
      const planState = state.get('planState').set('currentPlan', currentPlan)
      result = state.set('planState', planState)
      break
    case 'CHOOSE_RATING_SUGGESTION':
      const currentRating = state.get('planState').get('currentPlan').get('currentRating')
      const ratingsJs = state.get('planState').get('currentPlan').get('ratings').toJS()
      ratingsJs[currentRating].selectedSuggestionId = action.suggestionId
      const updatedCurrentPlan = state.get('planState').get('currentPlan').set('ratings', fromJS(ratingsJs))
      const updatedPlanState = state.get('planState').set('currentPlan', updatedCurrentPlan)
      const stateWithPlanToRecreate = state.set('planState', updatedPlanState)
      result = state.set('planState', state.get('planState').set('currentPlan', fromJS(createPlan(stateWithPlanToRecreate.toJS()))))
      break
    case 'GROUND_SELECTPLOT':
      result = mergeDeep(state, fromJS({ groundsState: { selectedPlot: action.value }}))
      break
    case 'GROUND_CHANGEDISPLAYDATE':
      result = mergeDeep(state, fromJS({ groundsState: { displayDate: action.value }}))
      break
    case 'TOGGLE_CULTURE_EDITION':
      result = mergeDeep(state, fromJS({ cultureState: { editedCulture: null, editing: !state.get('cultureState').get('editing') }}))
      break
    case 'BEGIN_EDIT_CULTURE':
      const updatedCultureState = state.get('cultureState').set('editing', true).set('editedCulture', fromJS(action.data))
      result = merge(state, { cultureState: updatedCultureState })
      break
    case 'SAVE_CULTURE':
      result = saveCulture(state, action.data)
      result = searchCulture(result)
      break
    case 'REMOVE_CULTURE':
      const cultures = state.get('data').get('cultures').toJS()
      const updatedData = merge(state.get('data'), fromJS({ cultures: filter(culture => culture.id !== action.data.id, cultures) }))
      result = merge(state, { data : updatedData })
      result = searchCulture(result)
      break
    case 'SEARCH_CULTURE':
      result = searchCulture(state, action.data)
      break
    case 'DOWNLOAD_ALL_DATA':
      downloadSavedData(state.get('data').toJS())
      break
    case 'TOGGLE_LOGENTRY_CREATION':
      result = mergeDeep(state, fromJS({ logState: { editedEntry: null, editing: !state.get('logState').get('editing') }}))
      break
    case 'SAVE_LOGENTRY':
      result = saveLogEntry(state, action.data)
      result = searchLog(result)
      break
    case 'REMOVE_LOGENTRY':
      const logEntries = state.get('data').get('log').toJS()
      const updatedDataForLogEntry = merge(state.get('data'), fromJS({ log: filter(logEntry => logEntry.id !== action.data.id, logEntries) }))
      result = merge(state, { data : updatedDataForLogEntry })
      result = searchLog(result)
      break
    case 'BEGIN_EDIT_LOGENTRY':
      const updatedLogState = state.get('logState').set('editing', true).set('editedEntry', fromJS(action.data))
      result = merge(state, { logState: updatedLogState })
      break
    case 'SEARCH_LOG':
      result = searchLog(state, action.data)
      break
    default:
  }
  localStorage.setItem('state', JSON.stringify(result.toJS()))
  return result
}
