import React from 'react'
import { map, includes, join, filter, addIndex } from 'ramda'
import moment from 'moment'

export const statussesOptions = [{
  label: 'Planifié',
  value: 0
},
{
  label: 'Semé',
  value: 1
},
{
  label: 'Implanté',
  value: 2
},
{
  label: 'En récolte',
  value: 3
},
{
  label: 'Détruit',
  value: 100
}]

export const getCultureDetails = (culture, log, tasks) => {
    const logEntries = addIndex(map)((logEntry, idx) => (<li key={idx}>{ moment(logEntry.date).format('L') + ' [' + join(', ', logEntry.tags) + '] : ' + logEntry.description}</li>),
      filter(logEntry => includes(culture.id, logEntry.cultures), log))
    const idxedTasks = addIndex(map)((task, idx) => <li key={idx}>{ moment(task.date).format('L') + ': ' + task.type }</li>, filter(task => task.cultureId === culture.id, tasks))
    return (<div>
      {logEntries.length > 0 ? (<div><p>Journal</p><ul>{ logEntries }</ul></div>) : 'Rien dans le journal ...'}
      {idxedTasks.length > 0 ? (<div><p>Tâches</p><ul>{ idxedTasks }</ul></div>) : 'Aucune tâche programmée ...'}
    </div>)
  }
