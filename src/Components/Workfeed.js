import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { find, sort } from 'ramda'
import styled from 'styled-components'
import Table from './Table'

const getDelayColor = days => {
  if(days === 0) return 'inherit'
  if(days < -10) days = -10
  if(days > 10) days = 10
  if(days < 0) {
    return Number(255).toString(16) + Math.round(Number(255/10 * (10 + days))).toString(16) + Number(255/10 * 10 + days).toString(16)
  } else {

    return Math.round(Number((255/10) * (days - 1))).toString(16) + Number(255).toString(16) + Math.round(Number((255/10) * (days - 1))).toString(16)
  }
}
const Delay = styled.span`
  color: #${props => getDelayColor(props.days)}
`

class Workfeed extends React.Component {
  constructor(props) {
    super(props)
    this.data = {
      cultures: this.props.data.get('cultures') ? this.props.data.get('cultures').toJS() : [],
      products: this.props.data.get('products') ? this.props.data.get('products').toJS() : [],
      tasks: this.props.data.get('tasks') ? this.props.data.get('tasks').toJS() : [],
    }
    this.tasks = sort((a, b) => a.date.localeCompare(b.date), this.data.tasks)
  }

  render() {
    const cols = [
      {
        title: 'Date',
        sort: {
          value: task => task.date,
          type: 'date'
        },
        flex: '1',
        content: task => <span>{moment(task.date).format('L')} <Delay days={moment(task.date).diff(moment(), 'days')}>{moment(task.date).diff(moment(), 'days')}</Delay></span>
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
          const culture = find(culture => culture.id === task.cultureId, this.data.cultures)
          const product = find(product => product.name === culture.productName, this.data.products)
          return product.name + ' - ' + moment(culture.plantDate).format('L')
        }
      }
    ]

    return (<Table data={this.tasks} dataColumns={cols} />)
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
