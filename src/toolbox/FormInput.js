import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import Select, { Async, AsyncCreatable } from 'react-select'
import moment from 'moment'
import '../../node_modules/react-datepicker/dist/react-datepicker.min.css'
import '../../node_modules/react-select/dist/react-select.min.css'

const InputStyled = styled.input`
  border: ${props =>
    props.used && props.error ? '1px solid red' : '1px solid #222'};
  flex-grow: 1;
`

const TextArea = styled.textarea`
  border: ${props =>
    props.used && props.error ? '1px solid red' : '1px solid #222'};
  flex-grow: 1;
  height: 4rem;`

const DatePickerStyled = styled(DatePicker)`
  border: ${props =>
    props.used && props.error ? '1px solid red' : '1px solid #222'};
`

const SelectAsyncStyled = styled(Async)`
border: ${props =>
  props.used && props.error ? '1px solid red' : '1px solid #222'};
flex-grow: 1;
`
const SelectStyled = styled(Select)`
border: ${props =>
  props.used && props.error ? '1px solid red' : '1px solid #222'};
flex-grow: 1;
`

const SelectCreatableStyled = styled(AsyncCreatable)`
border: ${props =>
  props.used && props.error ? '1px solid red' : '1px solid #222'};
flex-grow: 1;
`

const Field = styled.label`
  font-weight: bold;
  > div {
    display: flex;
    flex-direction: row;
  }
`

const FieldBlock = styled.div`
  margin-bottom: 0.5rem;
`

const MandatoryMarker = styled.span`
  color: red;
  margin-left: 0.5rem;
`
const ValidationError = styled.p`
  color: red;
  margin-top: 0.25rem;
  margin-bottom: 0;
`

class FormInput extends React.Component {
  render() {
    let element = null
    if (this.props.type === 'textArea') {
      element = (
        <TextArea
          type={this.props.type}
          value={this.props.value}
          onChange={e => this.props.onChange(e)}
          onBlur={e => this.props.lostFocus(e)}
          used={this.props.used}
          error={this.props.error}
        />
      )
    } else if (this.props.type === 'checkbox') {
      element = (
        <InputStyled
          type={this.props.type}
          checked={this.props.value === 'true'}
          onChange={e => this.props.onChange(e)}
          onBlur={e => this.props.lostFocus(e)}
          used={this.props.used}
          error={this.props.error}
        />
      )
    } else if (this.props.type === 'select') {
      if (this.props.creatable) {
        element = (
          <SelectCreatableStyled
            name={this.props.name}
            value={this.props.value}
            default={this.props.multi ? [] : null}
            autoload={false}
            multi={this.props.multi}
            onChange={e => this.props.onChange(e)}
            onBlur={e => this.props.lostFocus(e)}
            loadOptions={this.props.loadOptions}
          />
        )
      } else if(this.props.async) {
        element = (
          <SelectAsyncStyled
            name={this.props.name}
            value={this.props.value}
            default={this.props.multi ? [] : null}
            autoload={false}
            multi={this.props.multi}
            onChange={e => this.props.onChange(e)}
            onBlur={e => this.props.lostFocus(e)}
            loadOptions={this.props.loadOptions}
          />
        )
      } else {
        element = (
          <SelectStyled
            name={this.props.name}
            value={this.props.value}
            default={this.props.multi ? [] : null}
            autoload={true}
            multi={this.props.multi}
            onChange={e => this.props.onChange(e)}
            onBlur={e => this.props.lostFocus(e)}
            options={this.props.options}
          />
        )
      }
    } else if (this.props.type === 'date') {
      element = (
        <DatePickerStyled
          selected={this.props.value ? moment(this.props.value) : null}
          onChange={e => this.props.onChange(e)}
          onBlur={e => this.props.lostFocus(e)}
          used={this.props.used}
          error={this.props.error}
        />
      )
    } else {
      element = (
        <InputStyled
          type={this.props.type}
          value={this.props.value}
          onChange={e => this.props.onChange(e)}
          onBlur={e => this.props.lostFocus(e)}
          used={this.props.used}
          error={this.props.error}
        />
      )
    }
    return (
      <FieldBlock>
        <Field>
          {this.props.label}
          <div>
            {element}
            {this.props.required && <MandatoryMarker>*</MandatoryMarker>}
          </div>
        </Field>
        {this.props.used &&
          this.props.error &&
          <ValidationError>{this.props.error}</ValidationError>}
      </FieldBlock>
    )
  }
}

FormInput.propTypes = {
  value: PropTypes.any,
  required: PropTypes.bool,
  error: PropTypes.string,
  used: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  lostFocus: PropTypes.func,
  loadOptions: PropTypes.func,
  creatable: PropTypes.bool,
  async: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })),
  multi: PropTypes.bool
}

export default FormInput
