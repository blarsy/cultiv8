import { forEach, any } from 'ramda'

export const planCulture = (product, plantDate, surfaces) => {
  const cultureToPlan = {
    product: product,
    plantDate,
    //Foreseen culture destruction date: time to grow - time in nursery + harvesting duration
    destroyDate: new Date(plantDate).setDate(plantDate.getDate() + (product.growingDays - product.nurseryDays + product.harvestDays ))
  }
  forEach(surface => {
    if(!surface.cultures) surface.cultures = []
    surface.cultures.push(cultureToPlan)
  }, surfaces)
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

export const surfaceIsAvailableInPeriod = (surface, dates) => {
  if(surface.cultures && surface.cultures.length > 0) {
    //surface is available if it doesn't host any culture in the target date period
    return !any(culture => dates.plantBetween.min < culture.destroyDate && dates.plantBetween.max > culture.plantDate, surface.cultures)
  }
  return true
}
