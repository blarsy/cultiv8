import { take, put, fork, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { error } from '../Events'
import { fromSpreadsheet, fromJson } from '../domain/importer'
import tasksInventorizer from '../domain/TasksInventorizer'

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
    fork(importFromSpreadsheetFlow)
  ])
}
