import { take, put, call, fork, cancel, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { authorize } from '../ext/linkedIn'
import auth from '../ext/Auth'
import { error } from '../Events'
import { SERVER_API_URL } from '../config'
import { fromSpreadsheet, fromJson } from '../domain/importer'
import tasksInventorizer from '../domain/TasksInventorizer'

function* loginLinkedInFlow() {
  while (true) {
    yield take('LOGIN_LINKEDIN_REQUEST')
    const task = yield fork(loginLinkedIn)
    const action = yield take(['LOGOUT_REQUEST', 'LOGIN_LINKEDIN_ERROR'])
    if (action.type === 'LOGOUT_REQUEST') yield cancel(task)
  }
}

function* loginLinkedIn() {
  try {
    const res = yield call(authorize)
    auth.storeToken(res.token)
    yield put({
      type: 'LOGIN_SUCCESS',
      profile: res.profile,
      token: res.token
    })
    yield put(push('/home'))
  } catch (error) {
    if (error !== 'CANCELLED') {
      yield put({ type: 'LOGIN_LINKEDIN_ERROR', error })
    } else {
      yield put({ type: 'LOGIN_LINKEDIN_CANCELLED' })
    }
    yield put({ type: 'LOGOUT_REQUEST' })
  }
}

function* loginGoogleFlow() {
  while (true) {
    const action = yield take('LOGIN_GOOGLE_REQUEST')
    yield fork(loginGoogle, action)
  }
}

function* loginGoogle(loginResponse) {
  try {
    auth.storeToken(loginResponse.token)
    yield put({
      type: 'LOGIN_SUCCESS',
      profile: loginResponse.profile,
      token: loginResponse.token
    })
  } catch (err) {
    error(err)
  }
}

function* logoutFlow() {
  while (true) {
    yield take('LOGOUT_REQUEST')
    yield fork(logout)
  }
}

function* logout() {
  try {
    yield call(auth.logout)
    yield put({ type: 'LOGOUT_SUCCESS' })
  } catch (err) {
    error(err)
  }
}

function* restoreUserSessionFlow() {
  while (true) {
    yield take('RESTORE_USERSESSION_REQUEST')
    yield fork(restoreUserSession)
  }
}

function* restoreUserSession() {
  try {
    const loginResponse = yield call(auth.getRestoredSession)
    yield put({
      type: 'RESTORE_USERSESSION_SUCCESS',
      profile: loginResponse.profile,
      token: loginResponse.token
    })
  } catch (err) {
    error(err)
  }
}

function* importFromLinkedInFlow() {
  while (true) {
    const action = yield take('IMPORT_FROM_LINKEDIN')
    yield fork(importFromLinkedIn, action)
  }
}

function* importFromLinkedIn(action) {
  try {
    var formData = new FormData()

    formData.append('file', action.file)

    const importedCV = yield fetch(`${SERVER_API_URL}/importFromLinkedIn`, {
      method: 'POST',
      body: formData
    }).then(response => response.json())

    yield put({ type: 'IMPORT_FROM_LINKEDIN_SUCCESS', data: importedCV })
  } catch (err) {
    error(err)
  }
}

function* importFromSpreadsheetFlow() {
  while(true) {
    const action= yield take('IMPORTFILE_SELECTED')
    if(action.file.name.toLowerCase().endsWith('.json')) {
      yield fork(importFromJson, action.file)
    } else {
      yield fork(importFromSpreadsheet, action.file)
    }
  }
}

function* importFromSpreadsheet(file) {
  try {
    const parseResult = yield fromSpreadsheet(file)

    if(parseResult.err){
      yield put({type: 'IMPORTFILE_FAILED', data: parseResult.err})
    } else {
      yield put({ type: 'IMPORTFILE_UPLOADED', data: parseResult, tasks: tasksInventorizer(parseResult)})
      yield put(push('/home'))
    }
  }
  catch(err){
    yield put({type: 'IMPORTFILE_FAILED', data: err})
    error(err)
  }
}

function* importFromJson(file) {
  try {
    const parseResult = yield fromJson(file)

    if(parseResult.err){
      yield put({type: 'IMPORTFILE_FAILED', data: parseResult.err})
    } else {
      yield put({ type: 'IMPORTFILE_UPLOADED', data: parseResult, tasks: tasksInventorizer(parseResult)})
      yield put(push('/home'))
    }
  }
  catch(err){
    yield put({type: 'IMPORTFILE_FAILED', data: err})
    error(err)
  }
}

export default function* rootSaga() {
  yield all([
    fork(importFromLinkedInFlow),
    fork(importFromSpreadsheetFlow)
  ])
}
