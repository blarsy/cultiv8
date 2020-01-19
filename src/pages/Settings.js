import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { ValidatedForm, getInitialState } from '../toolbox'

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.inputs = [
      {
        type: 'number',
        name: 'totalSurface',
        label: 'Surface totale (en ares)',
        required: true
      }
    ]

    this.state = getInitialState(this.inputs)
    this.state = { ...this.state, ...props.settings.toJS() }
  }
  render() {
    return (
      <ValidatedForm
        margin="10%"
        getState={() => this.state}
        setState={state => this.setState(state)}
        inputs={this.inputs}
        onSubmit={() => {
          this.props.dispatch({ type: 'SAVE_SETTINGS', data: this.state })
        }}
        actionLabel="Ok"
        title="Paramètres globaux"
        error={this.state.error}
      />
    )
  }
}

Settings.propTypes = {
  settings: PropTypes.shape({
    totalSurface: PropTypes.number
  })
}

const mapStateToProps = state => ({
  settings: (state.global.get('data') && state.global.get('data').get('settings')) || fromJS({})
})

export default connect(mapStateToProps)(Settings)
