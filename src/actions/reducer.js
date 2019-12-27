import { Map, fromJS, mergeDeep, merge } from 'immutable'
import { forEach, forEachObjIndexed, any, map, find, filter } from 'ramda'
import moment from 'moment'
import createPlan from '../domain/createPlan'
import { addCulture } from '../domain/planner'
import fileDownload from 'js-file-download'

const persistedState = localStorage.getItem('state')
const initialState = persistedState ?
  fromJS(JSON.parse(persistedState)):
  Map({
    groundsState: {
      displayDate: moment(new Date())
    },
    cultureState: {
      creating: false
    }
  })

const MakeBlankPlanState = products => {
  const selections = {}
  forEach(product => selections[product.name]={ surface: product.surface, selected: false }, products)
  return Map({ selectedPlot: null, selections: fromJS(selections), allSelected: false })
}

const saveCulture = (state, cultureData) => {
  const cultures = state.get('data').get('cultures').toJS()
  const surfaces = state.get('data').get('surfaces').toJS()
  const products = state.get('data').get('products').toJS()
  const selectedSurfaces = map(selectedSurface => {
    const split = selectedSurface.value.split('ùùù')
    return {
      plot: split[0],
      code: split[1]
    }
  }, cultureData.surfaces)
  const cultureSurfaces = filter(surface => any(selectedSurface => selectedSurface.plot === surface.plot && selectedSurface.code === surface.code, selectedSurfaces), surfaces)
  const cultureToAdd = addCulture(
    find(product => product.name === cultureData.product.value, products),
    cultureData.plantDate,
    cultureSurfaces,
    cultureData.status.value
  )
  forEach(surface => cultures.push({
    productName: cultureData.product.value,
    status: cultureData.status.value,
    plantDate: cultureData.plantDate,
    plot: surface.plot,
    code: surface.code
  }), cultureSurfaces)
  const updatedData = merge(state.get('data'), { cultures: fromJS(cultures), surfaces: fromJS(surfaces) })
  const cultureState = state.get('cultureState')
  return merge(state, {data: updatedData, cultureState: cultureState.set('creating', false)})
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
      result = state.set('uploading', false)
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
      result = state.set('planState', updatedPlanState)
      break
    case 'GROUND_SELECTPLOT':
      result = mergeDeep(state, fromJS({ groundsState: { selectedPlot: action.value }}))
      break
    case 'GROUND_CHANGEDISPLAYDATE':
      result = mergeDeep(state, fromJS({ groundsState: { displayDate: action.value }}))
      break
    case 'BEGIN_CREATE_CULTURE':
      result = mergeDeep(state, fromJS({ cultureState: { creating: true }}))
      break
    case 'CANCEL_CREATE_CULTURE':
      result = mergeDeep(state, fromJS({ cultureState: { creating: false }}))
      break
    case 'SAVE_CULTURE':
      result = saveCulture(state, action.data)
      break
    case 'DOWNLOAD_ALL_DATA':
      downloadSavedData(state.get('data').toJS())
    default:
  }
  localStorage.setItem('state', JSON.stringify(result.toJS()))
  return result
}
