import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { map } from 'ramda'
import SearchForm from '../SearchForm'
import { FlexBlock } from '../../toolbox'
import { greedinessOptions, monthesOptions, greenhouseOptions, getFamiliesOptions } from './common'

class ProductSearch extends React.Component {
  constructor(props) {
    super(props)

    this.familiesOptions = getFamiliesOptions(props.products.toJS())

    this.state = { name: '', greenhouse: 1, sowMin: '', sowMax: '' }
  }

  render() {
    return (<SearchForm formState="productState" actionName="SEARCH_PRODUCT" searchData={this.state} setState={args => this.setState(args)}>
      <FlexBlock isContainer flex="0 0 50%" flexFlow="column" justifyContent="stretch">
        <span>Nom</span>
        <input type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
      </FlexBlock>
      <FlexBlock flex="0 0 50%">
        <span>Famille</span>
        <Select multi value={this.state.families} options={this.familiesOptions} onChange={e => this.setState({ families: map(item => item.value, e) })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>Gourmandise</span>
        <Select multi value={this.state.greedinesses} options={greedinessOptions} onChange={e => this.setState({ greedinesses: map(item => item.value, e) })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>Serre/Plein champ</span>
        <Select value={this.state.greenhouse} options={greenhouseOptions} onChange={e => this.setState({ greenhouse: e ? e.value: null })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>Planté/semé entre</span>
        <Select value={this.state.sowMin} options={monthesOptions} onChange={e => this.setState({ sowMin: e ? e.value : null })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>et</span>
        <Select value={this.state.sowMax} options={monthesOptions} onChange={e => this.setState({ sowMax: e ? e.value : null })}/>
      </FlexBlock>
    </SearchForm>)
  }
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products')
})

export default connect(mapStateToProps)(ProductSearch)
