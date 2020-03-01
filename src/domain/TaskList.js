import { reject, includes } from 'ramda'
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
    this.tasks = reject(task => task.cultureId === cultureId && includes(task.type, ['seed', 'plant', 'harvest', 'destroy']), this.tasks)
  }

  removeCultureTasks(cultureId) {
    this.tasks = reject(task => task.cultureId === cultureId, this.tasks)
  }
}
