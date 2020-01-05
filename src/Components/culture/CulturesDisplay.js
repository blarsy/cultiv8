import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find } from 'ramda'
import styled from 'styled-components'
import moment from 'moment'
import { FlexBlock, Button } from '../../toolbox'
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
          ratio: 1,
          content: culture => moment(culture.plantDate).format('L')
        },
        {
          ratio: 2,
          content: culture => culture.productName
        },
        {
          ratio: 2,
          content: culture => 'Surfaces: ' + map(surface => surface.plot + ' ' + surface.code + ' ', culture.surfaces)
        },
        {
          ratio: 1,
          content: culture => find(option => option.value === culture.status, statussesOptions).label
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
  surfaces: state.global.get('data').get('surfaces'),
  data: (state.global.get('cultureState') && state.global.get('cultureState').get('lastSearchResult')) ? state.global.get('cultureState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(CulturesDisplay)
