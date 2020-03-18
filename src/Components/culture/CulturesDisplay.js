import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, find, includes, join, filter, addIndex } from 'ramda'
import moment from 'moment'
import SearchResultsDisplay from '../SearchResultsDisplay'
import { statussesOptions } from './common'

class CulturesDisplay extends React.Component {
  getCultureDetails(culture) {
    const logEntries = addIndex(map)((logEntry, idx) => (<li key={idx}>{ moment(logEntry.date).format('L') + ' [' + join(', ', logEntry.tags) + '] : ' + logEntry.description}</li>),
      filter(logEntry => includes(culture.id, logEntry.cultures), this.props.log))
    const tasks = addIndex(map)((task, idx) => <li key={idx}>{ moment(task.date).format('L') + ': ' + task.type }</li>, filter(task => task.cultureId === culture.id, this.props.tasks))
    return (<div>
      {logEntries.length > 0 ? (<div><p>Journal</p><ul>{ logEntries }</ul></div>) : 'Rien dans le journal ...'}
      {tasks.length > 0 ? (<div><p>Tâches</p><ul>{ tasks }</ul></div>) : 'Aucune tâche programmée ...'}
    </div>)
  }

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
    return (<SearchResultsDisplay detailedContent={ culture => this.getCultureDetails(culture) } searchResults={searchResults} />)
  }
}

CulturesDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    plantDate: PropTypes.string,
    productName: PropTypes.string,
    surfaces: PropTypes.arrayOf(PropTypes.number),
    status: PropTypes.number
  }))
}

const mapStateToProps = state => ({
  surfaces: state.global.get('data').get('surfaces').toJS(),
  log: state.global.get('data').get('log').toJS(),
  tasks: state.global.get('data').get('tasks').toJS(),
  data: (state.global.get('cultureState') && state.global.get('cultureState').get('lastSearchResult')) ? state.global.get('cultureState').get('lastSearchResult').toJS() : []
})

export default connect(mapStateToProps)(CulturesDisplay)
