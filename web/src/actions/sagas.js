import { take, put, fork, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { error } from '../Events'
import { fromSpreadsheet, fromJson } from '../domain/importer'

const makeHtmlTable = array => {
  const lines = []
  array.forEach(line => {
    lines.push(line.join(';'))
  })
  return lines.join('\n')
}

function* copyToClipboardFlow() {
  while(true) {
    const action = yield take('COPY_TABLE_BEGIN')
    yield fork(copyToClipboard, action.data)
  }
}

function* copyToClipboard(data) {
  const waitForDelay = delay => new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
  try {
    yield navigator.clipboard.writeText(makeHtmlTable(data))
    yield put({type: 'COPY_TABLE_DONE'})
  }
  catch(err){
    yield put({type: 'COPY_TABLE_DONE', err})
  }
  yield waitForDelay(3000)
  yield put({ type: 'RESET_UI_STATE'})
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
      yield put({ type: 'IMPORTFILE_UPLOADED', data: parseResult})
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
      yield put({ type: 'IMPORTFILE_UPLOADED', data: parseResult })
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
    fork(importFromSpreadsheetFlow),
    fork(copyToClipboardFlow)
  ])
}
