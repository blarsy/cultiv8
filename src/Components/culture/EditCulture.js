import React from 'react'
import PropTypes from 'prop-types'
import { sort, map, forEach, find } from 'ramda'
import { connect } from 'react-redux'
import moment from 'moment'
import { fromJS } from 'immutable'
import { ValidatedForm, getInitialState } from '../../toolbox'
import { surfaceIsAvailableForCulture } from '../../domain/planner'
import { statussesOptions } from './common'

class EditCulture extends React.Component {
  constructor(props) {
    super(props)

    this.surfaces = this.props.surfaces.toJS()
    this.products = this.props.products.toJS()
    const surfacesOptions = sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()), map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.plot + 'ùùù' + surface.code }), this.surfaces))
    const productOptions = map(product => ({
      label: product.name,
      value: product.name
    }), sort((a, b) => a.name.localeCompare(b.name), this.products))

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
        label: 'Produit',
        required: true,
        options: productOptions
      },
      {
        type: 'select',
        name: 'status',
        label: 'Statut',
        required: true,
        options: statussesOptions
      },
      {
        type: 'select',
        name: 'surfaces',
        label: 'Surfaces',
        required: true,
        options: surfacesOptions,
        multi: true
      }
    ]

    this.state = getInitialState(this.inputs)
    if(props.cultureState && props.cultureState.get('editedCulture')) {
      const cultureToEdit = props.cultureState.get('editedCulture').toJS()
      const initialData = {
        plantDate: moment(cultureToEdit.plantDate).toDate(),
        status: find(option => option.value === cultureToEdit.status, statussesOptions).value,
        product: find(option => option.value === cultureToEdit.productName, productOptions).value
      }
      if(cultureToEdit.surfaces && cultureToEdit.surfaces.length > 0) {
        initialData.surfaces = map(surface => surface.plot + 'ùùù' + surface.code, cultureToEdit.surfaces)
      }
      this.state = { ...this.state, ...initialData }
    }
  }

  validateCulture() {
    const unavailableSurfaces = []
    forEach(surfaceId => {
      const split = surfaceId.split('ùùù')
      const plot = split[0]
      const code = split[1]
      const surface = find(surface => surface.plot === plot && surface.code === code, this.surfaces)
      const cultureToCheck = {
        product: find(product => product.name === this.state.product, this.products),
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
    )
  }
}

EditCulture.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products') || fromJS([]),
  surfaces: state.global.get('data').get('surfaces') || fromJS([]),
  cultureState: state.global.get('cultureState')
})

export default connect(mapStateToProps)(EditCulture)
