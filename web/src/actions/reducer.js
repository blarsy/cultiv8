import { Map, fromJS } from 'immutable'

const persistedState = localStorage.getItem('state')
const initialState = persistedState ? fromJS(JSON.parse(persistedState)): Map({})

export default (state = initialState, action) => {
  switch (action.type) {
    case 'IMPORTFILE_SELECTED':
      return state.set('uploading', true)
    case 'IMPORTFILE_FAILED':
      return state.set('uploading', false)
    case 'LOGIN_LINKEDIN_REQUEST':
      return state.set('loggingInLinkedIn', true)
    case 'LOGIN_SUCCESS':
      return state
        .set('loggingInLinkedIn', false)
        .set('profile', action.profile)
        .set('token', action.token)
    case 'LOGIN_LINKEDIN_ERROR':
      return state
        .set('loggingInLinkedIn', false)
        .set('loginError', action.error)
    case 'LOGIN_LINKEDIN_CANCELLED':
      return state.set('loggingInLinkedIn', false)
    case 'LOGOUT_SUCCESS':
      return state
        .set('loggingInLinkedIn', false)
        .set('profile', null)
        .set('token', null)
    case 'IMPORT_FROM_LINKEDIN_SUCCESS':
      return state.set('cv', action.data)
    case 'IMPORTFILE_UPLOADED':
      return state.set('uploading', false).set('data', fromJS(action.data)).set('tasks', fromJS(action.tasks))
    default:
  }
  localStorage.setItem('state', JSON.stringify(state.toJS()))
  return state
}
