import React from 'react'
import PropTypes from 'prop-types'
import { sort, map, append, any, forEach, find } from 'ramda'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState, FlexBlock } from '../../toolbox'
import Select from 'react-select'
import { surfaceIsAvailableForCulture } from '../../domain/planner'

class EditCulture extends React.Component {
  constructor(props) {
    super(props)

    this.state = { selectedSurfaces: [] }
    this.surfaces = this.props.surfaces.toJS()
    this.products = this.props.products.toJS()

    const statusses = [{
      label: 'Planifié',
      value: 0
    },
    {
      label: 'Implanté',
      value: 1
    },
    {
      label: 'Détruit',
      value: 2
    }]

    this.inputs = [
      {
        type: 'date',
        name: 'plantDate',
        label: 'Date de semis ou implantation',
        required: true,
        default: new Date()
      },
      {
        type: 'select',
        name: 'product',
        label: 'Production',
        required: true,
        options: map(product => ({
          label: product.name,
          value: product.name
        }), sort((a, b) => a.name.localeCompare(b.name), this.products))
      },
      {
        type: 'select',
        name: 'status',
        label: 'Statut',
        required: true,
        options: statusses,
        default: statusses[0]
      },
      {
        type: 'select',
        name: 'surfaces',
        label: 'Surfaces',
        required: true,
        options: sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()), map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.plot + 'ùùù' + surface.code }), this.surfaces)),
        multi: true
      }
    ]

    this.state = getInitialState(this.inputs)
  }

  validateCulture() {
    const unavailableSurfaces = []
    forEach(surfaceId => {
      const split = surfaceId.value.split('ùùù')
      const plot = split[0]
      const code = split[1]
      const surface = find(surface => surface.plot === plot && surface.code === code, this.surfaces)
      const cultureToCheck = {
        product: find(product => product.name === this.state.product.value, this.products),
        plantDate: this.state.plantDate
      }
      if(!surfaceIsAvailableForCulture(surface, cultureToCheck)) {
        unavailableSurfaces.push(surface)
      }
    }, this.state.surfaces)
    if(unavailableSurfaces.length > 0) {
      this.setState({
        error: 'Certaines surfaces ne sont pas disponibles pour toutes la durée de cette culture: ' + map(surface => surface.plot + ' ' + surface.code, unavailableSurfaces)
      })
      return false
    } else {
      this.setState({
        error: ''
      })
      return true
    }
  }

  render() {
    return (
      <FlexBlock isContainer flexFlow="column" flex="1" justifyContent="stretch">
        <ValidatedForm
          margin="10%"
          getState={() => this.state}
          setState={state => this.setState(state)}
          inputs={this.inputs}
          onSubmit={() => {
            if(this.validateCulture()) {
              this.props.onEditDone(this.state)
            }
          }}
          actionLabel="Ok"
          title="Edition culture"
          error={this.state.error}
        />
      </FlexBlock>
    )
  }
}

EditCulture.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products'),
  surfaces: state.global.get('data').get('surfaces')
})

export default connect(mapStateToProps)(EditCulture)
