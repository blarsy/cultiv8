import { find, filter, max, reject, any } from 'ramda'
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

  add(productName, status, plantDate, surfaces, statusChangeDate) {
    const newId = nextId(this.cultures)
    const culture = {
      id: newId,
      productName,
      status,
      plantDate,
      surfaces
    }
    this.cultures.push(culture)

    this.processStatusChange(culture, statusChangeDate || moment(new Date(new Date().setHours(0,0,0,0))).toISOString())
    return newId
  }

  update(id, productName, status, plantDate, surfaces, statusChangeDate) {
    const cultureToUpdate = find(culture => culture.id === id, this.cultures)
    const previousStatus = cultureToUpdate.status
    if(productName) cultureToUpdate.productName = productName
    cultureToUpdate.status = status
    if(plantDate) cultureToUpdate.plantDate = plantDate
    if(surfaces && surfaces.length > 0) cultureToUpdate.surfaces = surfaces

    if(previousStatus !== status) this.processStatusChange(cultureToUpdate, statusChangeDate || moment(new Date(new Date().setHours(0,0,0,0))).toISOString())
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
      case 100:
        return 'détruit'
      default:
    }
  }

  processStatusChange(culture, changeDate) {
    const product = this.productFromName(culture.productName)
    const status = culture.status
    if(!culture.statusHistory) culture.statusHistory = [{date: changeDate, status: culture.status}]
    else culture.statusHistory.push({date: changeDate, status: culture.status})

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
    } else if(status === 100){
      this.taskList.removeCultureAutoTasks(culture.id)
    }
    this.logEntriesList.add(moment(changeDate).toISOString(), ['Action'], `statuts passé en '${this.getStatusLabel(status)}'` , [], [], [culture.id])

  }

  splitByStatus(cultureId, surfaces, targetStatus, switchDate) {
    // As the switch applies only to some of the surfaces assigned to the culture,
    // we must create a new culture with only the concened surfaces, and unassign
    // those from the original culture
    const originalCulture = find(culture => culture.id === cultureId, this.cultures)
    originalCulture.surfaces = reject(surface => any(newCultureSurface => surface === newCultureSurface, surfaces), originalCulture.surfaces)

    const newCultureId = this.add(
      originalCulture.productName,
      targetStatus,
      originalCulture.plantDate,
      surfaces,
      switchDate
    )

    this.logEntriesList.linkEntriesToSplitCulture(originalCulture.id, newCultureId)

    return newCultureId
  }
}
