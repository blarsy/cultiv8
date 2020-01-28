import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { find } from 'ramda'
import Table from './Table'

class Workfeed extends React.Component {
  render() {
    const data = {
      cultures: this.props.data.get('cultures') ? this.props.data.get('cultures').toJS() : [],
      products: this.props.data.get('products') ? this.props.data.get('products').toJS() : [],
      tasks: this.props.data.get('tasks') ? this.props.data.get('tasks').toJS() : [],
    }
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
        content: task => {
          const culture = find(culture => culture.id === task.cultureId, data.cultures)
          const product = find(product => product.name === culture.productName, data.products)
          return product.name + ' - ' + moment(culture.plantDate).format('L')
        }
      }
    ]

    return (<Table data={data.tasks} dataColumns={cols} />)
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
