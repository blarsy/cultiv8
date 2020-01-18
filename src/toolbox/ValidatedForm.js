import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button } from '../toolbox'
import { isFormValid, setInputValidity } from './FormValidation'
import Input from './Input'
import R from 'ramda'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: ${props => '0 ' + props.margin || '1rem'};
  flex: 1
`
const FormBlock = styled.article`
  display: flex;
  flex-direction: column;
  margin: 0 0 1rem;
  align-items: ${props => props.align || 'stretch'};
`
const Title = styled.p`
  text-align: center;
  margin: 0;
  font-size: 16pt;
`

const ValidationError = styled.p`
  color: red;
  margin-top: 0.25rem;
  margin-bottom: 0;
`

class ValidatedForm extends React.Component {
  isFormValid() {
    return !isFormValid(this.props.getState(), this.props.inputs)
  }

  setInputValidity(input, isValid) {
    const found = R.find(R.propEq('input', input), this.inputs)

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
          this.props.onSubmit(e)
        }}
      >
        <Title>{this.props.title}</Title>
        {this.props.inputs.map(input => {
          const state = this.props.getState()
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
              'custom'
            ].includes(input.type)
          ) {
            return (
              <Input
                key={input.name}
                name={input.name}
                type={input.type}
                value={state[input.name]}
                onChange={value => {
                  this.props.setState({ [input.name]: value })
                }}
                required={input.required}
                label={input.label}
                validations={input.validations || []}
                loadOptions={input.loadOptions}
                setInputValidity={(inputName, isValid) =>
                  setInputValidity(
                    inputName,
                    isValid,
                    state,
                    this.props.setState
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
          {this.props.error &&
            <ValidationError>{this.props.error}</ValidationError>
          }
          <Button type="submit" disabled={this.isFormValid()}>
            {this.props.actionLabel || 'Save'}
          </Button>
        </FormBlock>
      </Form>
    )
  }
}

ValidatedForm.propTypes = {
  title: PropTypes.string.isRequired,
  margin: PropTypes.string,
  setState: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  actionLabel: PropTypes.string,
  error: PropTypes.string,
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
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      }))
    })
  ).isRequired
}

export default ValidatedForm
