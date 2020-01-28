import { filter, includes } from 'ramda'
import moment from 'moment'

export default class TaskList {
  constructor(data) {
    this.tasks = data.tasks || []
  }

  tasks() {
    return this.tasks
  }

  add(type, date, cultureId) {
    this.removeCultureAutoTasks(cultureId)
    this.tasks.push({ type, date, cultureId, creation: moment().toISOString() })
  }

  removeCultureAutoTasks(cultureId) {
    this.tasks = filter(task => task.cultureId === cultureId && includes(task.status, ['seed', 'plant', 'harvest', 'destroy']), this.tasks)
  }
}
