import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { map, sort } from 'ramda'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import SearchForm from '../SearchForm'
import { FlexBlock } from '../../toolbox'

class LogSearch extends React.Component {
  constructor(props) {
    super(props)

    this.tagsOptions = sort((a, b) => a.label.localeCompare(b.label), map(tag => ({ value: tag, label: tag }), props.tags.toJS()))
    if(props.cultures) {
      this.culturesOptions = sort((a,b) => a.label.localeCompare(b.label), map(culture => ({ value: culture.id, label: `${culture.productName} - ${moment(culture.plantDate).format('L')}`}), props.cultures.toJS()))
    }
    this.surfacesOptions = sort((a,b) => a.label.localeCompare(b.label), map(surface => ({ value: surface.plot + 'ùùù' + surface.code, label: surface.plot + ' ' + surface.code}), props.surfaces.toJS()))
    this.logToSearch = props.logEntries ? props.logEntries.toJS() : []

    this.state = { description: '' }
  }

  render() {
    return (<SearchForm formState="logState" actionName="SEARCH_LOG" searchData={this.state} setState={args => this.setState(args)}>
      <FlexBlock flex="0 0 50%">
        <span>Tags</span>
        <Select multi value={this.state.tags} options={this.tagsOptions} onChange={e => this.setState({ tags: e })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%">
        <span>Cultures</span>
        <Select multi value={this.state.cultures} options={this.culturesOptions} onChange={e => this.setState({ cultures: e })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%">
        <span>Surfaces</span>
        <Select multi value={this.state.surfaces} options={this.surfacesOptions} onChange={e => this.setState({ surfaces: e })}/>
      </FlexBlock>
      <FlexBlock flex="0 0 50%" isContainer flexFlow="column" justifyContent="stretch">
        <span>Mot-clé</span>
        <input type="text" value={this.state.description} onChange={e => this.setState({ description: e.target.value })}/>
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

const mapStateToProps = state => ({
  cultures: state.global.get('data').get('cultures'),
  surfaces: state.global.get('data').get('surfaces'),
  tags: state.global.get('data').get('logTags') || List(),
  logEntries: state.global.get('data').get('log'),
})

export default connect(mapStateToProps)(LogSearch)
