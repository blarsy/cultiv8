import { forEach, any, find } from 'ramda'
import moment from 'moment'

export const addCulture = (product, plantDate, surfaces, status) => {
  const cultureToAdd = {
    product: product,
    plantDate,
    status
  }
  forEach(surface => {
    if(!surface.cultures) surface.cultures = []
    surface.cultures.push(cultureToAdd)
  }, surfaces)
  return cultureToAdd
}

export const getNextRange = (product, refDate) => {
  const makeRange = (sowMin, sowMax, year, nurseryDays) => ({
    sowBetween: {
      min: new Date(year, sowMin, 1),
      max: new Date(year, sowMax, 1)
    },
    plantBetween: {
      min: new Date(year, sowMin, nurseryDays),
      max: new Date(year, sowMax, nurseryDays)
    }
  })
    //Remember: monthes are 0 based in javascript
  const sowMin = product.sowMin - 1
  //When the sowing period crosses the end of year, adapt the sowMax
  const sowMax = (product.sowMin < product.sowMax) ? product.sowMax - 1 : product.sowMax + 12 - 1

  //Assume sowMin and sowMax in the current year are doable ...
  const naiveDates = makeRange(sowMin, sowMax, refDate.getFullYear(), product.nurseryDays)
  if(naiveDates.sowBetween.max < refDate){
    // ... and if not, just add a year
    return makeRange(sowMin, sowMax, refDate.getFullYear() + 1, product.nurseryDays)
  }
  return naiveDates
}

export const surfaceIsAvailableForCulture = (surface, culture) => {
  return surfaceIsAvailableBetweenDates(surface, culture.plantDate, getDestructionDate(culture))
}

const surfaceIsAvailableBetweenDates = (surface, begin, end) => {
  const mBegin = moment(begin)
  const mEnd = moment(end)
  if(surface.cultures && surface.cultures.length > 0) {
    //surface is available if it doesn't host any culture in the target date period
    return !any(culture => mBegin < getDestructionDate(culture) && mEnd > moment(culture.plantDate), surface.cultures)
  }
  return true
}

export const surfaceIsAvailableInPeriod = (surface, dates) => {
  return surfaceIsAvailableBetweenDates(surface, dates.plantBetween.min, dates.plantBetween.max)
}

export const getDestructionDate = culture => {
  const plantDate = moment(culture.plantDate)
  const daysOnField = culture.product.growingDays - culture.product.nurseryDays + culture.product.harvestDays
  const destructionDate = plantDate.add(daysOnField, 'days')
  return destructionDate
}

export const cultureIsActive = (date, culture) => {
  const primitiveDate = moment(date)
  const plantDate = moment(culture.plantDate)
  const destructionDate = getDestructionDate(culture)
  return plantDate.toDate() <= primitiveDate.toDate() && destructionDate.toDate() >= primitiveDate.toDate()
}

export const assignCulturesToSurfaces = data => {
  forEach(culture => {
    const product = find(product => product.name === culture.productName, data.products)
    const surface = find(surface => culture.plot === surface.plot && culture.code === surface.code, data.surfaces)
    if(!surface.cultures) surface.cultures = []
    surface.cultures.push({
      product,
      plantDate: culture.plantDate,
      status: culture.status
    })
  }, data.cultures)
}
