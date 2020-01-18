import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find } from 'ramda'
import moment from 'moment'
import { FlexBlock } from '../../toolbox'
import SearchResultsDisplay from '../SearchResultsDisplay'

class LogEntriesDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.cultures = props.cultures ? props.cultures.toJS() : []
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
          flex: '1',
          content: logEntry => moment(logEntry.date).format('L')
        },
        {
          title: 'Infos',
          noSort: true,
          flex: '2',
          content: logEntry => (<FlexBlock isContainer flexFlow="column">{ logEntry.tags.length >= 0 && <span>Tags: {map(tag => tag, logEntry.tags)}</span> }
            { logEntry.surfaces && logEntry.surfaces.length >= 0 && <span>Surfaces: {map(surface => surface.plot + ' ' + surface.code, logEntry.surfaces)}</span> }
            { logEntry.cultures && logEntry.cultures.length >= 0 && <span>Cultures: {map(cultureId => {
              const culture = find(culture => culture.id === cultureId, this.cultures)
              return culture.productName + ' ' + moment(culture.plantDate).format('L')
            }, logEntry.cultures)}</span> }
          </FlexBlock>)
        },
        {
          title: 'Contenu',
          flex: '4',
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
  data: (state.global.get('logState') && state.global.get('logState').get('lastSearchResult')) ? state.global.get('logState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(LogEntriesDisplay)
