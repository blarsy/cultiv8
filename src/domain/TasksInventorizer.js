import { forEach, find, filter } from 'ramda'
import moment from 'moment'

export default data => {
  const results = []
  //Sewing cultures in plan
  //Planting cultures in plan
  //Removing ended cultures
  if(data.cultures){
    forEach(culture => {
      const result = {
        culture: culture.id
      }
      if (culture.status === 0) {
        //Culture planned: scheduled seeding/Planting
        result.date = culture.plantDate
        result.type = 'seed'
      } else {
        const product = find(product => product.name === culture.productName, data.products)
        if (culture.status === 1) {
          //culture in place: plan planting in the field, or harvest
          if(product.nurseryDays > 0) {
            result.date = moment(culture.plantDate).add(product.nurseryDays, 'days').toISOString()
            result.type = 'plant'
          } else {
            result.date = moment(culture.plantDate).add(product.growingDays, 'days').toISOString()
            result.type = 'harvest'
          }
        } else if (culture.status === 2) {
          result.date = moment(culture.plantDate).add(product.growingDays, 'days').toISOString()
          result.type = 'harvest'
        } else if (culture.status === 3) {
          result.date = moment(culture.plantDate).add(product.growingDays + product.harvestDays, 'days').toISOString()
          result.type = 'destroy'
        }
      }
      results.push(result)
    }, filter(culture => culture.status !== 100, data.cultures))
  }
  //Planning fertilization of surfaces after a full cycle of cultures greediness
  return results
}
