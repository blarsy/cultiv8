import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import inventorize from '../domain/TasksInventorizer'
import Table from './Table'

class Workfeed extends React.Component {
  render() {
    const data = {
      cultures: this.props.data.get('cultures').toJS(),
      products: this.props.data.get('products').toJS()
    }
    const tasks = inventorize(data)
    const cols = [
      {
        title: 'Date',
        sort: {
          value: task => task.date,
          type: 'date'
        },
        flex: '1',
        content: task => moment(task.date).format('L')
      },
      {
        title: 'Tâche',
        flex: '1',
        content: task => task.type
      },
      {
        title: 'Culture',
        flex: '2',
        content: task => task.culture
      }
    ]

    return (<Table data={tasks} dataColumns={cols} />)
  }
}

Workfeed.propTypes = {
  data: PropTypes.object
}

const mapStateToProps = state => {
  return {
    data: state.global.get('data')
  }
}

export default connect(mapStateToProps)(Workfeed)
