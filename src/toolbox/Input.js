import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import FormInput from './FormInput'

class Input extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: '', used: false, value: props.value }
    this.validations = this.props.validations || []

    if (this.props.required)
      this.validations = [this.validateRequired, ...this.validations]
  }

  componentDidMount() {
    this.props.setInputValidity(
      this.props.name,
      !this.validate(this.props.value)
    )
  }

  validateRequired(value) {
    if (Array.isArray(value) && value.length === 0) return 'Value required'
    if (typeof value === 'number') return ''
    if (!value) return 'Value required'
    return ''
  }

  validate(value) {
    for (let i = 0; i < this.validations.length; i++) {
      const error = this.validations[i](value)
      if (error) return error
    }
    return ''
  }

  onChange(e) {
    let value
    if (this.props.type === 'date') value = e ? e.format() : ''
    else if (this.props.type === 'select') {
      if(this.props.multi) {
        value = map(item => item.value, e)
      } else {
        value = e.value
      }
    } else if ((e.target.type && e.target.type) === 'checkbox')
      value = e.target.checked.toString()
    else if (e.target.type && (e.target.type === 'number'))
      value = +e.target.value
    else value = e.target.value

    const error = this.validate(value)

    this.setState({
      error,
      value
    })
    this.props.onChange(value)
    this.props.setInputValidity(this.props.name, !error)
  }

  lostFocus(e) {
    let value = null
    if (this.props.type === 'date') value = e
    else if (this.props.type === 'select') value = this.state.value
    else value = e.target.value
    this.setState({ used: true, error: this.validate(value) })
  }

  render() {
    if (
      [
        'text',
        'password',
        'email',
        'textArea',
        'checkbox',
        'date',
        'select',
        'number'
      ].includes(this.props.type)
    ) {
      return (
        <FormInput
          value={this.state.value}
          readOnly={this.props.readOnly}
          name={this.props.name}
          required={this.props.required}
          error={this.state.error}
          used={this.state.used}
          onChange={e => this.onChange(e)}
          lostFocus={e => this.lostFocus(e)}
          label={this.props.label}
          type={this.props.type}
          loadOptions={this.props.loadOptions}
          creatable={this.props.creatable}
          multi={this.props.multi}
          async={this.props.async}
          options={this.props.options}
          customElement={this.props.customElement}
        />
      )
    }
    return null
  }
}

Input.propTypes = {
  value: PropTypes.any,
  required: PropTypes.bool,
  validations: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  loadOptions: PropTypes.func,
  creatable: PropTypes.bool,
  readOnly: PropTypes.bool,
  async: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })),
  multi: PropTypes.bool
}

export default Input
