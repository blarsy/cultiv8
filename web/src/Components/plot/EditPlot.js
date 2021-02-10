import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { find } from 'ramda'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState } from '../../toolbox'

class EditPlot extends React.Component {
  constructor(props) {
    super(props)

    let plotToEdit
    if(props.groundsState && props.groundsState.get('editedPlot')) {
      plotToEdit = props.groundsState.get('editedPlot').toJS()
    }

    this.inputs = [
      {
        type: 'text',
        name: 'code',
        label: 'Code',
        required: true,
        readOnly: !!find(plot => plot.code === plotToEdit.code, this.props.plots.toJS())
      },
      {
        type: 'text',
        name: 'name',
        label: 'Nom',
        required: true
      }
    ]

    this.state = getInitialState(this.inputs)
    this.state = { ...this.state, ...plotToEdit }
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
      title="Edition parcelle"
      error={this.state.error}
    />)
  }
}

EditPlot.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  groundsState: state.global.get('groundsState'),
  plots: state.global.get('data').get('plots') || List()
})

export default connect(mapStateToProps)(EditPlot)
