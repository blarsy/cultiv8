import React from 'react'
import moment from 'moment'
import { sort } from 'ramda'
import styled from 'styled-components'
import Table from './Table'
import { Button} from '../toolbox'
import RescheduleTask from './task/RescheduleTask'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Route, useRouteMatch } from 'react-router-dom'
import { AppContextConsumer } from '../AppContext'

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

export default () =>  {
  const getTasksQry = gql`{
    tasks {_id, type, creation, date, culture {_id, plantDate, product{name}}}
  }`
  const [deleteTask] = useMutation(gql`
    mutation DeleteTask($id: ID!) {
      deleteTask(_id: $id)
    }
  `)

  const { loading, error, data } = useQuery(getTasksQry)
  let { path, url } = useRouteMatch()
  if(loading) return 'Loading...'
  if(error) return error
  const sortedTasks = sort((a, b) => a.date.localeCompare(b.date), data.tasks)
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
          (<Button key="pencil" icon="pencil" to={`/cultures/${task.culture._id}`}></Button>),
          (<Button key="edit" icon="clock" to={`${url}/reschedule/${task._id}`}></Button>),
          (<AppContextConsumer key="remove">
              {context => (<Button icon="trash" onClick={() => {
                context.setContext({
                  modal: {
                    message: 'Effacer la tâche de type "' + captionFromTaskType(task.type) +  '" concernant la culture "' + task.culture.product.name + ' - ' + moment(task.culture.plantDate).format('L') + '" ?',
                    onOk: () => {
                      context.setContext({
                        message: 'Effacement ...',
                        waiter: true
                      })
                      deleteTask({
                        variables: {id: task._id},
                        update: (cache, { data }) => {
                          const existingTasks = cache.readQuery({ query: getTasksQry })
                          const newTasks = existingTasks.tasks.filter((t) => (t._id !== task._id))
                          cache.writeQuery({
                            query: getTasksQry,
                            data: {tasks: newTasks}
                          })
                          context.setContext({ modal: null })
                         }
                      })
                    }
                  }
                })
              }} />)}
          </AppContextConsumer>)
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
        return task.culture.product.name + ' - ' + moment(task.culture.plantDate).format('L')
      }
    }
  ]
  return [
    (<Route key="1" exact path={path}>
      <Table data={sortedTasks} dataColumns={cols} />
    </Route>),
    (<Route key="2" path={`${path}/reschedule/:taskId`}>
      <RescheduleTask/>
    </Route>)
  ]
}
