import { find, filter, max, reject, any, reverse } from 'ramda'
import moment from 'moment'
import TaskList from './TaskList'
import LogEntriesList from './LogEntriesList'
import { nextId } from './data'

export default class CultureList {
  constructor(data) {
    this.cultures = data.cultures || []
    this.surfaces = data.surfaces || []
    this.taskList = new TaskList(data)
    this.products = data.products || []
    this.logEntriesList = new LogEntriesList(data)
  }

  data() {
    return {
      cultures: this.cultures,
      surfaces: this.surfaces,
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
      plantDate: moment(plantDate).toISOString(),
      surfaces
    }
    this.cultures.push(culture)

    this.processStatusChange(culture, statusChangeDate || moment(new Date(new Date().setHours(0,0,0,0))))
    return newId
  }

  update(id, productName, status, plantDate, surfaces, statusChangeDate) {
    const cultureToUpdate = find(culture => culture.id === id, this.cultures)
    const previousStatus = cultureToUpdate.status
    const previousPlantDate = cultureToUpdate.plantDate
    if(productName) cultureToUpdate.productName = productName
    cultureToUpdate.status = status
    if(plantDate) cultureToUpdate.plantDate = moment(plantDate).toISOString()
    if(surfaces && surfaces.length > 0) cultureToUpdate.surfaces = surfaces

    if(previousStatus !== status) this.processStatusChange(cultureToUpdate, statusChangeDate || moment(new Date(new Date().setHours(0,0,0,0))))
    else if(!moment(plantDate).isSame(previousPlantDate)) {
      this.recalculateTasks(cultureToUpdate)
    }
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

  recalculateTasks(culture) {
    const product = this.productFromName(culture.productName)
    const status = culture.status
    const baseDate = culture.statusHistory && culture.statusHistory.length > 1 ?
      find(statusSwitch => statusSwitch.status === status, reverse(culture.statusHistory)).date :
      culture.plantDate

    if(status === 0) {
      // Planned
      this.taskList.add('seed',max(moment(culture.plantDate).add(-product.nurseryDays, 'days').toISOString(), new Date(new Date().setHours(0,0,0,0))),culture.id)
    } else if(status === 1) {
      this.taskList.removeCultureAutoTasks(culture.id)
      // Sown
      if(product.nurseryDays > 0) {
        this.taskList.add('plant', moment(baseDate).add(product.nurseryDays, 'days').toISOString(), culture.id)
      } else {
        this.taskList.add('harvest', moment(baseDate).add(product.growingDays, 'days').toISOString(), culture.id)
      }
    } else if(status === 2) {
      this.taskList.removeCultureAutoTasks(culture.id)
      // Planted
      this.taskList.add('harvest', moment(baseDate).add(product.growingDays, 'days').toISOString(), culture.id)
    } else if(status === 3){
      this.taskList.removeCultureAutoTasks(culture.id)
      // Harvesting
      this.taskList.add('destroy', moment(baseDate).add(product.harvestDays, 'days').toISOString(), culture.id)
    } else if(status === 100){
      this.taskList.removeCultureAutoTasks(culture.id)
    }
  }

  processStatusChange(culture, changeDate) {
    const product = this.productFromName(culture.productName)
    const formattedChangedDate = moment(changeDate).toISOString()
    if(product.nurseryDays === 0) {
      if(culture.status === 1 || culture.status === 2) {
        culture.plantDate = formattedChangedDate
      }
    } else {
      if(culture.status === 2) {
        culture.plantDate = formattedChangedDate
      }
    }
    if(!culture.statusHistory) culture.statusHistory = [{date: formattedChangedDate, status: culture.status}]
    else culture.statusHistory.push({date: formattedChangedDate, status: culture.status})

    this.recalculateTasks(culture)

    this.logEntriesList.add(formattedChangedDate, ['Action'], `statuts passé en '${this.getStatusLabel(culture.status)}'` , [], [], [culture.id])
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
