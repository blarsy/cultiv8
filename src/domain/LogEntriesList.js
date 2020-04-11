import { find, filter, reject, any, forEach } from 'ramda'
import { nextId } from './data'

export default class LogEntriesList {
  constructor(data) {
    this.log = data.log || []
    this.logTags = data.logTags || []
  }

  logData() {
    return { log :this.log, logTags: this.logTags }
  }

  addTags(tags) {
    const tagsToCreate = filter(tag => !any(logTag => logTag.toLowerCase() === tag.toLowerCase(), this.logTags), tags)
    if(tagsToCreate.length > 0) {
      this.logTags.push(...tagsToCreate)
    }
  }

  add(date, tags, description, surfaces, plots, cultures) {
    const logEntry = {
      id: nextId(this.log),
      date,
      tags,
      description,
      surfaces,
      plots,
      cultures
    }
    this.addTags(tags)
    this.log.push(logEntry)
  }

  linkEntriesToSplitCulture(originalCultureId, newCultureId) {
    forEach(logEntry => logEntry.cultures.push(newCultureId), filter(logEntry => any(logCulture => logCulture === originalCultureId, logEntry.cultures), this.log))
  }

  update(id, date, tags, description, surfaces, plots, cultures) {
    const logEntryToUpdate = find(logEntry => logEntry.id === id, this.log)
    logEntryToUpdate.date = date
    logEntryToUpdate.tags = tags
    logEntryToUpdate.description = description
    logEntryToUpdate.surfaces = surfaces
    logEntryToUpdate.plots = plots
    logEntryToUpdate.cultures = cultures

    this.addTags(tags)
  }

  removeCultureLogEntries(cultureId) {
    this.log = filter(logEntry => {
      if(!logEntry.cultures.includes(cultureId)) return true
      if(logEntry.cultures.length === 1) return false
      logEntry.cultures = reject(logEntryCultureId => logEntryCultureId === cultureId,  logEntry.cultures)
    }, this.log)
  }
}
