import { Map, fromJS, mergeDeep, merge, find } from 'immutable'
import { forEach, forEachObjIndexed, filter } from 'ramda'
import moment from 'moment'
import fileDownload from 'js-file-download'
import createPlan from '../domain/createPlan'
import { setStateRight, searchLog, searchCulture, searchProduct, saveCulture, saveLogEntry, saveProduct, recalculateSurfaces } from './stateTransformers'

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
  },
  productState: {
    editing: false
  },
  settings: {
    totalSurface: 10
  }
})
const initialState = persistedState ?
  setStateRight(fromJS(JSON.parse(persistedState))):
  blankState

const MakeBlankPlanState = products => {
  const selections = {}
  forEach(product => selections[product.name]={ surface: product.surface, selected: false }, products)
  return Map({ selectedPlot: null, selections: fromJS(selections), allSelected: false })
}

const downloadSavedData = data => {
  forEach(surface => delete surface.cultures, data.surfaces)
  fileDownload(JSON.stringify(data), `cultiv8Data-${moment().format('YYYYMMDD-HHmmss')}.json`)
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
      const dataBeforeImport = state.get('data') || fromJS({})
      const dataAfterImport = setStateRight(dataBeforeImport.merge(fromJS(action.data)))
      result = blankState
        .set('data', dataAfterImport)
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
      if(!currentSelections1[action.name]) {
        const newProduct = find(product => product.name === action.name, state.get('data').get('products').toJS())
        currentSelections1[action.name]= { selected: true, surface: newProduct.surface }
      } else {
        forEachObjIndexed((selection,name) => {
          if(name === action.name) {
            selection.selected = !selection.selected
          }
        } , currentSelections1)
      }
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
    case 'SEARCH_PRODUCT':
      result = searchProduct(state, action.data)
      break
    case 'TOGGLE_PRODUCT_CREATION':
      result = mergeDeep(state, fromJS({ productState: { editedProduct: null, editing: !state.get('productState').get('editing') }}))
      break
    case 'BEGIN_EDIT_PRODUCT':
      const updatedProductState = state.get('productState').set('editing', true).set('editedProduct', fromJS(action.data))
      result = merge(state, { productState: updatedProductState })
      break
    case 'SAVE_PRODUCT':
      result = saveProduct(state, action.data)
      result = searchProduct(result)
      break
    case 'SAVE_SETTINGS':
      const currentTotalSurface = state.get('settings').get('totalSurface')
      result = state.set('settings', fromJS({ totalSurface : action.data.totalSurface }))
      if(currentTotalSurface !== action.data.totalSurface) {
        result = recalculateSurfaces(result)
      }
      break
    case 'DISMISS_SEARCHRESULT':
      const updatedState = state.get(action.stateName).set('lastSearchResult', fromJS([]))
      result = state.set(action.stateName, updatedState)
      break
    default:
  }
  localStorage.setItem('state', JSON.stringify(result.toJS()))
  return result
}
