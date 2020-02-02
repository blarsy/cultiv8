import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find } from 'ramda'
import moment from 'moment'
import SearchResultsDisplay from '../SearchResultsDisplay'

class LogEntriesDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.cultures = props.cultures ? props.cultures.toJS() : []
    this.plots = props.plots ? props.plots.toJS() : []
  }

  render() {
    const searchResults = {
      data: this.props.data,
      removeActionName: 'REMOVE_LOGENTRY',
      editActionName: 'BEGIN_EDIT_LOGENTRY',
      dataColumns: [
        {
          title: 'Date',
          sort: {
            value: logEntry => logEntry.date,
            type: 'date'
          },
          flex: '1 0',
          content: logEntry => moment(logEntry.date).format('L')
        },
        {
          title: 'Tags',
          noSort: true,
          flex: '1 0',
          content: logEntry => (map(tag => tag, logEntry.tags))
        },
        {
          title: 'Surfaces',
          noSort: true,
          flex: '1 0',
          content: logEntry => logEntry.surfaces && logEntry.surfaces.length >= 0 && map(surface => surface.plot + ' ' + surface.code, logEntry.surfaces)
        },
        {
          title: 'Parcelles',
          noSort: true,
          flex: '1 0',
          content: logEntry => logEntry.plots && logEntry.plots.length >= 0 && map(plotCode => {
            const plot = find(plot => plot.code === plotCode, this.plots)
            return plot.name + ' - ' + plot.code
          }, logEntry.plots)
        },
        {
          title: 'Cultures',
          noSort: true,
          flex: '1 0',
          content: logEntry => logEntry.cultures && logEntry.cultures.length >= 0 && map(cultureId => {
            const culture = find(culture => culture.id === cultureId, this.cultures)
            return culture.productName + ' ' + moment(culture.plantDate).format('L')
          }, logEntry.cultures)
        },
        {
          title: 'Contenu',
          flex: '4 0',
          noSort: true,
          content: logEntry => logEntry.description
        }
      ]
    }
    return (<SearchResultsDisplay searchResults={searchResults} />)
  }
}

LogEntriesDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    cultures: PropTypes.arrayOf(PropTypes.number),
    surfaces: PropTypes.arrayOf(PropTypes.shape({
      plot: PropTypes.string,
      code: PropTypes.string
    })),
    description: PropTypes.string
  }))
}

const mapStateToProps = state => ({
  cultures: state.global.get('data').get('cultures'),
  plots: state.global.get('data').get('plots'),
  data: (state.global.get('logState') && state.global.get('logState').get('lastSearchResult')) ? state.global.get('logState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(LogEntriesDisplay)
