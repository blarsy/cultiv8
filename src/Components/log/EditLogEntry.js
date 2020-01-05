import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { sort, map, find } from 'ramda'
import moment from 'moment'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState } from '../../toolbox'

class EditLog extends React.Component {
  constructor(props) {
    super(props)

    const cultureOptions = sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()) || moment(b.plantDate).toDate() - moment(a.plantDate).toDate(), map(culture => ({ label: `${culture.productName} - ${moment(culture.plantDate).format('L')}`, value: culture.id }), props.cultures.toJS()))
    const surfaceOptions = sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()), map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.plot + 'ùùù' + surface.code }), props.surfaces.toJS()))
    const tagOptions = map(category => ({
      label: category,
      value: category
    }), sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()), props.tags.toJS()))

    this.inputs = [
      {
        type: 'date',
        name: 'date',
        label: 'Date',
        required: true,
        default: new Date()
      },
      {
        type: 'select',
        name: 'tags',
        label: 'Etiquettes',
        required: true,
        multi: true,
        creatable: true,
        options: tagOptions
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
        required: true
      },
      {
        type: 'select',
        name: 'linkedSurfaces',
        label: 'Surfaces concernées',
        required: false,
        options: surfaceOptions,
        multi: true
      },
      {
        type: 'select',
        name: 'linkedCultures',
        label: 'Cultures concernées',
        required: false,
        options: cultureOptions,
        multi: true
      }
    ]

    this.state = getInitialState(this.inputs)
    if(props.logState && props.logState.get('editedEntry')) {
      const logEntryToEdit = props.logState.get('editedEntry').toJS()
      const initialData = {
        date: moment(logEntryToEdit.date).toDate(),
        description: logEntryToEdit.description
      }
      if(logEntryToEdit.tags && logEntryToEdit.tags.length > 0) {
        initialData.tags = map(tag => find(tagOption => tagOption.value === tag, tagOptions), logEntryToEdit.tags)
      }
      if(logEntryToEdit.surfaces && logEntryToEdit.surfaces.length > 0) {
        initialData.linkedSurfaces = map(surface => find(option => option.value === surface.plot + 'ùùù' + surface.code, surfaceOptions), logEntryToEdit.surfaces)
      }
      if(logEntryToEdit.cultures && logEntryToEdit.cultures.length > 0) {
        initialData.linkedCultures = map(cultureId => find(option => option.value === cultureId, cultureOptions), logEntryToEdit.cultures)
      }
      this.state = { ...this.state, ...initialData }
    }
  }

  render() {
    return (<ValidatedForm
      margin="10%"
      getState={() => this.state}
      setState={state => this.setState(state)}
      inputs={this.inputs}
      onSubmit={() => {
        this.props.onEditDone(this.state)
      }}
      actionLabel="Ok"
      title="Edition entrée de journal"
      error={this.state.error}
    />)
  }
}

EditLog.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  cultures: state.global.get('data').get('cultures'),
  surfaces: state.global.get('data').get('surfaces'),
  tags: state.global.get('data').get('logTags') || List(),
  logState: state.global.get('logState'),
  log: state.global.get('log')
})

export default connect(mapStateToProps)(EditLog)
