import { forEach } from 'ramda'

export default (data) => {
  const result = []
  //Sewing cultures in plan
  //Planting cultures in plan
  //Removing ended cultures
  if(data.cultures){
    forEach(culture => {
      const currentMonth = new Date().getMonth()+1
      if(culture.sowMin < culture.sowMax) {
        if(currentMonth >= culture.sowMin && currentMonth <= culture.sowMax){
          result.push({type: 'seed', culture: culture.name, quantity: culture.surface})
        }
      }
      if(currentMonth <= culture.sowMin && currentMonth >= culture.sowMax){
        result.push({type: 'seed', culture: culture.name, quantity: culture.surface})
      }
    }, data.cultures)
  }
  //Planning fertilization of surfaces after a full cycle of cultures greediness
  return result
}
