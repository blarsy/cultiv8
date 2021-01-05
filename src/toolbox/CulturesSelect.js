import React from 'react'
import styled from 'styled-components'
import Select, { Async, AsyncCreatable, Creatable } from 'react-select'
import { FlexBlock } from './../toolbox'
import '../../node_modules/react-select/dist/react-select.min.css'

const SelectAsyncStyled = styled(Async)`
border: ${props =>
  props.used && props.error ? '1px solid red' : '1px solid #222'};
flex-grow: 1;
`

class CulturesSelect extends React.Component {
  render() {
    return <FlexBlock>
      <SelectAsyncStyled
        name={this.props.name}
        value={this.props.value}
        default=[]
        autoload={false}
        multi=true
        onChange={e => this.props.onChange(e)}
        onBlur={e => this.props.lostFocus(e)}
        loadOptions={this.props.loadOptions}
      />
    </FlexBlock>
  }
}

FormInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  lostFocus: PropTypes.func
}

export default CulturesSelect
