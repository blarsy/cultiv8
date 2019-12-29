import { map, all } from 'ramda'

export const isFormValid = (state, inputs) => {
  return all(
    val => val,
    map(input => {
      if (
        input.required &&
        (!Object.keys(state).includes(input.name) || state[input.name] === '')
      ) {
        return false
      } else {
        return state.validities[input.name]
      }
    }, inputs)
  )
}

export const getInitialState = inputs => {
  const initialState = { validities: {} }
  inputs.forEach(input => {
    let initialValue
    if (input.default) {
      if (input.type === 'date') initialValue = input.default.toJSON()
      else initialValue = input.default
    } else {
      initialValue = input.multi ? [] : ''
    }
    initialState[input.name] = initialValue
  })
  return initialState
}

export const setInputValidity = (inputName, isValid, state, setState) => {
  setState({
    validities: Object.assign(state.validities || {}, { [inputName]: isValid })
  })
}
