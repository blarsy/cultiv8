import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState } from '../../toolbox'

class RescheduleTask extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = [
      {
        type: 'date',
        name: 'newDate',
        label: 'Nouvelle date',
        required: true
      }
    ]

    this.state = getInitialState(this.inputs)
    this.state.newDate = this.props.initialDate
  }

  render() {
    return (<ValidatedForm
      margin="10%"
      getState={() => this.state}
      setState={state => this.setState(state)}
      inputs={this.inputs}
      onSubmit={() => {
        this.props.onDateModified(this.state.newDate)
      }}
      actionLabel="Ok"
      title="Edition Produit"
      error={this.state.error}
    />)
  }
}

RescheduleTask.propTypes = {
  initialDate: PropTypes.string,
  onDateModified: PropTypes.func
}

const mapStateToProps = state => ({
  tasks: state.global.get('data').get('tasks')
})

export default connect(mapStateToProps)(RescheduleTask)
