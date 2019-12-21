import { Map, fromJS, mergeDeep } from 'immutable'
import { forEach, forEachObjIndexed } from 'ramda'
import moment from 'moment'
import createPlan from '../domain/createPlan'

const persistedState = localStorage.getItem('state')
const initialState = persistedState ? fromJS(JSON.parse(persistedState)): Map({ groundsState: { displayDate: moment(new Date())} })

const MakeBlankPlanState = products => {
  const selections = {}
  forEach(product => selections[product.name]={ surface: product.surface, selected: false }, products)
  return Map({ selectedPlot: null, selections: fromJS(selections), allSelected: false })
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
    default:
  }
  localStorage.setItem('state', JSON.stringify(result.toJS()))
  return result
}
