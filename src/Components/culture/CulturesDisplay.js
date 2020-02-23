import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find } from 'ramda'
import moment from 'moment'
import SearchResultsDisplay from '../SearchResultsDisplay'
import { statussesOptions } from './common'

class CulturesDisplay extends React.Component {
  render() {
    const searchResults = {
      data: this.props.data,
      removeActionName: 'REMOVE_CULTURE',
      editActionName: 'BEGIN_EDIT_CULTURE',
      dataColumns: [
        {
          title: 'Date plantation',
          sort: {
            value: culture => culture.plantDate,
            type: 'date'
          },
          flex: '1',
          content: culture => moment(culture.plantDate).format('L')
        },
        {
          title: 'Produit',
          flex: '2',
          content: culture => culture.productName
        },
        {
          title: 'Surfaces',
          flex: '2',
          content: culture => map(cultureSurface => {
            const surfaceData = find(surface => surface.id === cultureSurface, this.props.surfaces)
            return surfaceData.plot + ' ' + surfaceData.code + ' '
          }, culture.surfaces)
        },
        {
          title: 'Statut',
          flex: '1',
          content: culture => {
            return find(option => option.value === culture.status, statussesOptions).label
          }
        }
      ]
    }
    return (<SearchResultsDisplay searchResults={searchResults} />)
  }
}

CulturesDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    plantDate: PropTypes.string,
    productName: PropTypes.string,
    surfaces: PropTypes.arrayOf(PropTypes.shape({
      plot: PropTypes.string,
      code: PropTypes.string
    })),
    status: PropTypes.number
  }))
}

const mapStateToProps = state => ({
  surfaces: state.global.get('data').get('surfaces').toJS(),
  data: (state.global.get('cultureState') && state.global.get('cultureState').get('lastSearchResult')) ? state.global.get('cultureState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(CulturesDisplay)
