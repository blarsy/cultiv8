import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find } from 'ramda'
import moment from 'moment'
import { FlexBlock } from '../../toolbox'
import SearchResultsDisplay from '../SearchResultsDisplay'
import { monthesOptions, greedinessOptions, greenhouseOptions } from './common'

class ProductsDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.products = props.products ? props.products.toJS() : []
  }

  render() {
    const searchResults = {
      data: this.props.data,
      removeActionName: 'REMOVE_PRODUCT',
      editActionName: 'BEGIN_EDIT_PRODUCT',
      dataColumns: [
        {
          title: 'Nom',
          flex: '1 0 10rem',
          content: product => product.name
        },
        {
          title: 'Famille',
          flex: '1 0 10rem',
          content: product => product.family
        },
        {
          title: 'Gourmandise',
          flex: '1 0 10rem',
          content: product => find(option => product.greediness === option.value, greedinessOptions).label
        },
        {
          title: 'Productivité',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.productivity
          },
          alignRight: true,
          content: product => product.productivity.toFixed(1)
        },
        {
          title: 'Unité',
          flex: '1 0 7rem',
          alignRight: true,
          content: product => product.unit
        },
        {
          title: 'Serre?',
          flex: '1 0 7rem',
          content: product => product.greenhouse
        },
        {
          title: 'Ratio surface',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.surfaceRatio
          },
          alignRight: true,
          content: product => product.surfaceRatio
        },
        {
          title: 'Surface',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.surface
          },
          alignRight: true,
          content: product => product.surface.toFixed(1)
        },
        {
          title: 'Surface serre',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.greenhouseSurface
          },
          alignRight: true,
          content: product => product.greenhouseSurface.toFixed(1)
        },
        {
          title: 'Semis tôt',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.sowMin
          },
          content: product => find(option => product.sowMin === option.value, monthesOptions).label
        },
        {
          title: 'Semis tard',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.sowMax
          },
          content: product => find(option => product.sowMax === option.value, monthesOptions).label
        },
        {
          title: 'Jours croiss',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.growingDays
          },
          alignRight: true,
          content: product => product.growingDays
        },
        {
          title: 'Jours pépi',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.nurseryDays
          },
          alignRight: true,
          content: product => product.nurseryDays
        },
        {
          title: 'Jours récolte',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.harvestDays
          },
          alignRight: true,
          content: product => product.harvestDays
        },
        {
          title: 'Heures travail',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.workPerSqMeter
          },
          alignRight: true,
          content: product => product.workPerSqMeter.toFixed(1)
        },
        {
          title: 'Plant par m2',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.plantsPerSqMeter
          },
          alignRight: true,
          content: product => product.plantsPerSqMeter.toFixed(1)
        },
        {
          title: 'Nbre plants',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.totalNumberOfPlants
          },
          alignRight: true,
          content: product => product.totalNumberOfPlants.toFixed(1)
        },
        {
          title: 'Prix bio',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.priceOrganic
          },
          alignRight: true,
          content: product => product.priceOrganic.toFixed(1)
        },
        {
          title: 'Prix choisi',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.actualPrice
          },
          alignRight: true,
          content: product => product.actualPrice.toFixed(1)
        },
        {
          title: 'Revenu m2',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.incomePerSqMeter
          },
          alignRight: true,
          content: product => product.incomePerSqMeter.toFixed(1)
        },
        {
          title: 'Revenu total',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.totalIncome
          },
          alignRight: true,
          content: product => product.totalIncome.toFixed(1)
        },
        {
          title: 'Revenu heure',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.incomePerWorkHour
          },
          alignRight: true,
          content: product => product.incomePerWorkHour.toFixed(1)
        },
        {
          title: 'Ratio occ. sol',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.soilOccupationRatio
          },
          alignRight: true,
          content: product => product.soilOccupationRatio.toFixed(1)
        },
        {
          title: 'Ratio travail',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.amountOfWorkRatio
          },
          alignRight: true,
          content: product => product.amountOfWorkRatio.toFixed(1)
        },
        {
          title: 'Indice intérêt',
          flex: '1 0 7rem',
          sort: {
            type: 'number',
            value: product => product.interestRatio
          },
          alignRight: true,
          content: product => product.interestRatio.toFixed(1)
        }
      ]
    }
    return (<SearchResultsDisplay searchResults={searchResults} />)
  }
}

ProductsDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    family: PropTypes.string
  }))
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products'),
  data: (state.global.get('productState') && state.global.get('productState').get('lastSearchResult')) ? state.global.get('productState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(ProductsDisplay)
