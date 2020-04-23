import { reject, includes, find } from 'ramda'
import moment from 'moment'
import { nextId } from './data'

export default class TaskList {
  constructor(data) {
    this.tasks = data.tasks || []
  }

  reschedule(id, newDate) {
    const taskToReschedule = find(task => task.id === id, this.tasks)
    taskToReschedule.date = moment(newDate).toISOString()
  }

  add(type, date, cultureId) {
    this.removeCultureAutoTasks(cultureId)
    this.tasks.push({ id: nextId(this.tasks), type, date, cultureId, creation: moment().toISOString() })
  }

  removeCultureAutoTasks(cultureId) {
    this.tasks = reject(task => task.cultureId === cultureId && includes(task.type, ['seed', 'plant', 'harvest', 'destroy']), this.tasks)
  }

  removeCultureTasks(cultureId) {
    this.tasks = reject(task => task.cultureId === cultureId, this.tasks)
  }
}
