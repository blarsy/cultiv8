import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Select from 'react-select'
import { List } from 'immutable'
import moment from 'moment'
import { sort, map, filter } from 'ramda'
import { FlexBlock } from './../toolbox'

import '../../node_modules/react-select/dist/react-select.min.css'

const SelectStyled = styled(Select)`
border: ${props =>
  props.used && props.error ? '1px solid red' : '1px solid #222'};
flex-grow: ${props => props.grow || '1'};
`


const DEFAULT_CULTURES_TYPE = 2

class CulturesSelect extends React.Component {
  constructor(props) {
    super(props)
    const options = [{
        label: 'non détruites',
        value: 1
      },{
        label: 'toutes',
        value: DEFAULT_CULTURES_TYPE
      }]
    const sortCultures = (a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()) || moment(b.plantDate).toDate() - moment(a.plantDate).toDate()
    const formatCultures = culture => ({ label: `${culture.productName} - ${moment(culture.plantDate).format('L')}`, value: culture.id })
    this.allCultures = sort(sortCultures, map(formatCultures, props.cultures.toJS()))
    this.nonDestroyedCultures = sort(sortCultures, map(formatCultures, filter(culture => culture.status < 100, props.cultures.toJS())))
    this.state = { culturesType: DEFAULT_CULTURES_TYPE, cultureOptions: this.applyCulturesFilter(DEFAULT_CULTURES_TYPE), culturesTypeOptions: options }
  }

  applyCulturesFilter(culturesType) {
    if(culturesType === 2)
      return this.allCultures
    else
    return this.nonDestroyedCultures
  }

  render() {

    return (<FlexBlock isContainer flex="1 0">
      <SelectStyled
        grow={3}
        name={this.props.name}
        value={this.props.value}
        default={[]}
        autoload={false}
        multi={true}
        onChange={e => this.props.onChange(e)}
        onBlur={e => this.props.lostFocus(e)}
        options={this.state.cultureOptions}
      />
      <SelectStyled
        name={this.props.name + '_status'}
        value={this.state.culturesType}
        onChange={e => {
          const cultureOptions = this.applyCulturesFilter(e.value)
          this.setState({ culturesType: e.value, cultureOptions })
        }}
        options={this.state.culturesTypeOptions}
        clearable={false}
      />
  </FlexBlock>)
  }
}

CulturesSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  lostFocus: PropTypes.func,
  name: PropTypes.string
}

const mapStateToProps = state => ({
  cultures: state.global.get('data').get('cultures') || List(),
})

export default connect(mapStateToProps)(CulturesSelect)
