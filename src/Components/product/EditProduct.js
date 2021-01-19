import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ValidatedForm, getInitialState } from '../../toolbox'
import { getFamiliesOptions, greedinessOptions, monthesOptions } from './common'


class EditProduct extends React.Component {
  constructor(props) {
    super(props)

    const familiesOptions = getFamiliesOptions(props.products.toJS())

    this.inputs = [
      {
        type: 'text',
        name: 'name',
        label: 'Nom',
        required: true
      },
      {
        type: 'select',
        name: 'family',
        label: 'Famille',
        required: true,
        creatable: true,
        options: familiesOptions
      },
      {
        type: 'select',
        name: 'greediness',
        label: 'Gourmandise',
        required: true,
        options: greedinessOptions
      },
      {
        type: 'number',
        name: 'productivity',
        label: 'Productivité m2',
        required: true
      },
      {
        type: 'text',
        name: 'unit',
        label: 'Unité',
        required: true
      },
      {
        type: 'checkbox',
        name: 'greenhouse',
        label: 'Serre ?',
        required: false
      },
      {
        type: 'number',
        name: 'surfaceRatio',
        label: 'Ratio surface',
        required: true
      },
      {
        type: 'select',
        name: 'sowMin',
        label: 'Semis tôt',
        required: true,
        options: monthesOptions
      },
      {
        type: 'select',
        name: 'sowMax',
        label: 'Semis tard',
        required: true,
        options: monthesOptions
      },
      {
        type: 'number',
        name: 'growingDays',
        label: 'Jours de croissance',
        required: true
      },
      {
        type: 'number',
        name: 'nurseryDays',
        label: 'Jours en pépinière',
        required: true
      },
      {
        type: 'number',
        name: 'harvestDays',
        label: 'Jours de récolte',
        required: true
      },
      {
        type: 'number',
        name: 'workPerSqMeter',
        label: 'Minutes de travail par m2',
        required: true
      },
      {
        type: 'number',
        name: 'plantsPerSqMeter',
        label: 'Plants par m2',
        required: true
      },
      {
        type: 'number',
        name: 'priceOrganic',
        label: 'Prix en bio',
        required: true
      },
      {
        type: 'number',
        name: 'actualPrice',
        label: 'Prix choisi hors taxe',
        required: true
      }
    ]

    this.state = getInitialState(this.inputs)
    if(props.productState && props.productState.get('editedProduct')) {
      const productToEdit = props.productState.get('editedProduct').toJS()
      this.state = { ...this.state, ...productToEdit }
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
      title="Edition Produit"
      error={this.state.error}
    />)
  }
}

EditProduct.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products'),
  productState: state.global.get('productState')
})

export default connect(mapStateToProps)(EditProduct)
