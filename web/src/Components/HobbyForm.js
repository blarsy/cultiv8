import React from 'react'
import PropTypes from 'prop-types'

import { ValidatedForm, getInitialState, Block } from '../toolbox'
import { HobbyPropType } from './CommonPropTypes'

const inputs = [
  {
    type: 'date',
    name: 'startDate',
    label: 'Start date',
    required: false
  },
  { type: 'date', name: 'endDate', label: 'End date', required: false },
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    type: 'text',
    name: 'description',
    label: 'Description',
    required: true
  }
]

class HobbyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState(inputs)
  }

  render() {
    return (
      <Block align="stretch">
        <ValidatedForm
          margin="20%"
          getState={() => this.state}
          setState={state => this.setState(state)}
          inputs={inputs}
          onSubmit={() => this.props.onEditDone(this.state)}
          actionLabel="Ok"
          title="Edit hobby"
        />
      </Block>
    )
  }
}

HobbyForm.propTypes = {
  initialData: PropTypes.shape(HobbyPropType),
  onEditDone: PropTypes.func
}

export default HobbyForm
