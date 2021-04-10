import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { propEq, find } from 'ramda'
import { Button } from '../toolbox'
import { isFormValid, setInputValidity } from './FormValidation'
import Input from './Input'
import { BlockTitle } from '../StyleLibrary'
import { getInitialState } from './FormValidation'
import Spinner from './Spinner'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: ${props => '0 ' + props.margin || '1rem'};
  flex: 1
`
const FormBlock = styled.article`
  display: flex;
  flex-direction: row;
  margin: 0 0 1rem;
  align-items: ${props => props.align || 'stretch'};
  justify-content: center
`

const ErrorMsg = styled.p`
  color: red;
  margin-top: 0.25rem;
  margin-bottom: 0;
`

class ValidatedForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...getInitialState(props.inputs),
      ...props.initialState
    }
  }
  isFormValid() {
    return !isFormValid(this.state, this.props.inputs)
  }

  setInputValidity(input, isValid) {
    const found = find(propEq('input', input), this.inputs)

    if (found) {
      found.isValid = isValid
    } else {
      this.inputs.push({ input, isValid })
    }
  }

  render() {
    return (
      <Form
        margin={this.props.margin || '2rem'}
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmit(this.state)
        }}
      >
        <BlockTitle>{this.props.title}</BlockTitle>
        {this.props.inputs.map(input => {
          if (
            [
              'text',
              'password',
              'email',
              'textArea',
              'checkbox',
              'date',
              'select',
              'number',
              'culturesSelect',
              'custom'
            ].includes(input.type)
          ) {
            return (
              <Input
                key={input.name}
                name={input.name}
                type={input.type}
                value={this.state[input.name]}
                readOnly={input.readOnly || this.props.processing}
                onChange={value => {
                  this.setState({ [input.name]: value })
                }}
                required={input.required}
                label={input.label}
                validations={input.validations || []}
                loadOptions={input.loadOptions}
                setInputValidity={(inputName, isValid) =>
                  setInputValidity(
                    inputName,
                    isValid,
                    this.state,
                    state => this.setState(state)
                  )}
                creatable={input.creatable}
                async={input.async}
                multi={input.multi}
                options={input.options}
                customElement={input.customElement}
              />
            )
          } else {
            return 'Unexpected input type !!'
          }
        })}
        <FormBlock align="center">
          {this.state.error &&
            <ErrorMsg>{this.state.error}</ErrorMsg>
          }
          <Button type="submit" disabled={this.isFormValid()}>
            {this.props.actionLabel || 'Save'}
          </Button>
          {this.props.processing && <Spinner size="2" />}
          {this.props.lastError &&
            <ErrorMsg>{this.props.lastError}</ErrorMsg>
          }
        </FormBlock>
      </Form>
    )
  }
}

ValidatedForm.propTypes = {
  title: PropTypes.string.isRequired,
  margin: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  actionLabel: PropTypes.string,
  initialState: PropTypes.object,
  processing: PropTypes.bool,
  lastError: PropTypes.string,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      label: PropTypes.string.isRequired,
      validations: PropTypes.arrayOf(PropTypes.func),
      loadOptions: PropTypes.func,
      creatable: PropTypes.bool,
      async: PropTypes.bool,
      multi: PropTypes.bool,
      readOnly: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      }))
    })
  ).isRequired
}

export default ValidatedForm
