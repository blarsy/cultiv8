import React from 'react'
import PropTypes from 'prop-types'

import { ValidatedForm, getInitialState, Block } from '../toolbox'
import { ExperiencePropType } from './CommonPropTypes'
import { request } from 'graphql-request'
import { GRAPHQL_URL } from '../config'

const inputs = [
  {
    type: 'text',
    name: 'role',
    label: 'Role',
    required: true
  },
  { type: 'checkbox', name: 'present', label: 'Present', required: false },
  {
    type: 'date',
    name: 'from',
    label: 'From',
    required: true,
    default: new Date()
  },
  { type: 'date', name: 'till', label: 'Till', required: false },
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
    type: 'select',
    name: 'organisation',
    label: 'Organisation',
    required: true,
    creatable: true,
    loadOptions: (input, callback) => {
      return request(
        GRAPHQL_URL,
        `{
            organisation(name: "${input}", limit: 10) {
              id
              name
            }
          }`
      ).then(data => {
        return {
          options: data.organisation.map(orga => ({
            label: `${orga.name}`,
            value: orga.id
          })),
          complete: true
        }
      })
    }
  }
]

class ExperienceForm extends React.Component {
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
          title="Edit experience"
        />
      </Block>
    )
  }
}

ExperienceForm.propTypes = {
  initialData: PropTypes.shape(ExperiencePropType),
  onEditDone: PropTypes.func
}

export default ExperienceForm
