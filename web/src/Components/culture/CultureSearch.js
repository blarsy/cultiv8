import React from 'react'
import { connect } from 'react-redux'
import { map, sort } from 'ramda'
import Select from 'react-select'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { fromJS } from 'immutable'
import { FlexBlock } from '../../toolbox'
import { statussesOptions } from './common'
import SearchForm from './../SearchForm'

class CultureSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = (props.logState && props.logState.get('lastSearchData')) ? props.logState.get('lastSearchData').toJS() : {}
    this.surfacesOptions = sort((a,b) => a.label.localeCompare(b.label), map(surface => ({ value: surface.id, label: surface.plot + ' ' + surface.code}), props.surfaces.toJS()))
    this.productsOptions = sort((a,b) => a.label.localeCompare(b.label), map(product => ({ value: product.name, label: product.name}), props.products.toJS()))
  }

  render() {
    return (<SearchForm formState="cultureState" actionName="SEARCH_CULTURE" searchData={this.state} setState={args => this.setState(args)}>
      <FlexBlock flex="0 0 50%">
        <span>Production</span>
        <Select multi value={this.state.products} options={this.productsOptions} onChange={e => this.setState({ products: map(item => item.value, e) })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%">
        <span>Status</span>
        <Select value={this.state.status} options={statussesOptions} onChange={e => this.setState({ status: e ? e.value : null })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%">
        <span>Surfaces</span>
        <Select multi value={this.state.surfaces} options={this.surfacesOptions} onChange={e => this.setState({ surfaces: map(item => item.value, e) })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>From date</span>
        <DatePicker selected={this.state.fromDate ? moment(this.state.fromDate) : null} onChange={e => this.setState({ fromDate: e ? e.format() : ''})}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>Till date</span>
        <DatePicker selected={this.state.tillDate ? moment(this.state.tillDate) : null} onChange={e => this.setState({ tillDate: e ? e.format() : ''})}/>
      </FlexBlock>
    </SearchForm>)
  }
}

const mapStateToProps = state => {
  return {
    products: (state.global.get('data') && state.global.get('data').get('products')) || fromJS([]),
    surfaces: state.global.get('data').get('surfaces') || fromJS([])
  }
}

export default connect(mapStateToProps)(CultureSearch)
