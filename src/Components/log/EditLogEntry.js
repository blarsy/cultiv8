import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { sort, map } from 'ramda'
import moment from 'moment'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState } from '../../toolbox'

class EditLog extends React.Component {
  constructor(props) {
    super(props)

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
        options: map(category => ({
          label: category,
          value: category
        }), sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()), props.tags.toJS()))
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
        options: sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()), map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.plot + 'ùùù' + surface.code }), props.surfaces.toJS())),
        multi: true
      },
      {
        type: 'select',
        name: 'linkedCultures',
        label: 'Cultures concernées',
        required: false,
        options: sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()) || moment(b.plantDate).toDate() - moment(a.plantDate).toDate(), map(culture => ({ label: `${culture.productName} - ${moment(culture.plantDate).format('L')}`, value: culture.id }), props.cultures.toJS())),
        multi: true
      }
    ]

    this.state = getInitialState(this.inputs)
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
  tags: state.global.get('data').get('logTags') || List()
})

export default connect(mapStateToProps)(EditLog)
