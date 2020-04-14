import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { find, sort } from 'ramda'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import Table from './Table'
import { Button } from '../toolbox'

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
    const captionFromTaskType = type => {
      switch(type) {
        case 'seed':
          return 'Semer'
        case 'plant':
          return 'Implanter'
        case 'harvest':
          return 'Récolter'
        case 'destroy':
          return 'Détruire'
        default:
          throw new Error('Bad Type')
      }
    }
    const cols = [
      {
        title: 'Actions',
        flex: '1',
        flexProps: {
          justifyContent: 'space-around',
          alignItems: 'center'
        },
        noSort: true,
        content: task => [
          (<Button key="pencil" icon="pencil" onClick={() => {
            this.props.dispatch({ type: 'BEGIN_EDIT_CULTURE', data: find(culture => culture.id === task.cultureId, this.data.cultures) })
            this.props.dispatch(push('/cultures'))
          }} />),
          (<Button key="reschedule" icon="clock" onClick={() => this.props.dispatch({ type: 'RESCHEDULE_TASK', task })} />)
        ]
      },
      {
        title: 'Date',
        sort: {
          value: task => task.date,
          type: 'date'
        },
        flex: '2',
        content: task => <span>{moment(task.date).format('L')} <Delay days={moment(task.date).diff(moment(), 'days')}>{moment(task.date).diff(moment(), 'days')}</Delay></span>
      },
      {
        title: 'Tâche',
        flex: '1',
        content: task => captionFromTaskType(task.type)
      },
      {
        title: 'Culture',
        flex: '3',
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
