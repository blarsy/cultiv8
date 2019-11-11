import React from 'react'
import PropTypes from 'prop-types'
import { request } from 'graphql-request'

import { ValidatedForm, getInitialState, Block } from '../toolbox'
import { GRAPHQL_URL } from '../config'
import { TrainingPropType } from './CommonPropTypes'

const inputs = [
  {
    type: 'date',
    name: 'date',
    label: 'Date',
    required: false
  },
  { type: 'checkbox', name: 'present', label: 'Present', required: false },
  {
    type: 'text',
    name: 'certificate',
    label: 'Diploma/Certificate',
    required: true
  },
  {
    type: 'select',
    name: 'city',
    label: 'City',
    required: true,
    loadOptions: (input, callback) => {
      return request(
        GRAPHQL_URL,
        `{
            city(name: "${input}", limit: 10) {
              id
              name
              countryCode
            }
          }`
      ).then(data => {
        return {
          options: data.city.map(city => ({
            label: `${city.name} (${city.countryCode})`,
            value: city.id
          })),
          complete: true
        }
      })
    }
  },
  {
    type: 'text',
    name: 'school',
    label: 'School/Organisation',
    required: true
  },
  {
    type: 'text',
    name: 'field',
    label: 'Field',
    required: false
  },
  {
    type: 'text',
    name: 'description',
    label: 'Description',
    required: false
  }
]

class TrainingForm extends React.Component {
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
          title="Edit training"
        />
      </Block>
    )
  }
}

TrainingForm.propTypes = {
  initialData: PropTypes.shape(TrainingPropType),
  onEditDone: PropTypes.func
}

export default TrainingForm
