import { find, filter, max } from 'ramda'
import moment from 'moment'
import TaskList from './TaskList'
import LogEntriesList from './LogEntriesList'
import { nextId } from './data'

export default class CultureList {
  constructor(data) {
    this.cultures = data.cultures || []
    this.taskList = new TaskList(data)
    this.products = data.products || []
    this.logEntriesList = new LogEntriesList(data)
  }

  data() {
    return {
      cultures: this.cultures,
      tasks: this.taskList.tasks,
      log: this.logEntriesList.log,
      logTags: this.logEntriesList.logTags
    }
  }

  add(productName, status, plantDate, surfaces) {
    const culture = {
      id: nextId(this.cultures),
      productName,
      status,
      plantDate,
      surfaces
    }
    this.cultures.push(culture)

    this.processStatusChange(culture)
  }

  update(id, productName, status, plantDate, surfaces) {
    const cultureToUpdate = find(culture => culture.id === id, this.cultures)
    cultureToUpdate.productName = productName
    cultureToUpdate.status = status
    cultureToUpdate.plantDate = plantDate
    cultureToUpdate.surfaces = surfaces

    this.processStatusChange(cultureToUpdate)
  }

  remove(id) {
    this.taskList.removeCultureTasks(id)
    this.logEntriesList.removeCultureLogEntries(id)
    this.cultures = filter(culture => culture.id !== id, this.cultures)
  }

  productFromName(productName) {
    return find(product => product.name === productName, this.products)
  }

  getStatusLabel(status) {
    switch (status) {
      case 0:
        return 'planifié'
      case 1:
        return 'semé'
      case 2:
        return 'implanté'
      case 3:
        return 'en récolte'
      case 4:
        return 'détruit'
      default:
    }
  }

  processStatusChange(culture) {
    const product = this.productFromName(culture.productName)
    const today = moment(new Date(new Date().setHours(0,0,0,0))).toISOString()
    const status = culture.status
    if(!culture.statusHistory) culture.statusHistory = [{date: today, status: culture.status}]
    else culture.statusHistory.push({date: today, status: culture.status})

    if(status === 0) {
      // Planned
      this.taskList.add('seed',max(moment(culture.plantDate).add(-product.nurseryDays, 'days'), new Date(new Date().setHours(0,0,0,0))),culture.id)
    } else if(status === 1) {
      this.taskList.removeCultureAutoTasks(culture.id)
      // Sown
      if(product.nurseryDays > 0) {
        this.taskList.add('plant', moment(culture.plantDate).add(product.nurseryDays, 'days').toISOString(), culture.id)
      } else {
        this.taskList.add('harvest', moment(culture.plantDate).add(product.growingDays, 'days').toISOString(), culture.id)
      }
    } else if(status === 2) {
      this.taskList.removeCultureAutoTasks(culture.id)
      // Planted
      this.taskList.add('harvest', moment(culture.plantDate).add(product.growingDays, 'days').toISOString(), culture.id)
    } else if(status === 3){
      this.taskList.removeCultureAutoTasks(culture.id)
      // Harvesting
      this.taskList.add('destroy', moment(culture.plantDate).add(product.growingDays + product.harvestDays, 'days').toISOString(), culture.id)
    } else if(status === 4){
      this.taskList.removeCultureAutoTasks(culture.id)
    }
    this.logEntriesList.add(today, ['Action'], `statuts passé en '${this.getStatusLabel(status)}'` , [], [], [culture.id])

  }
}
