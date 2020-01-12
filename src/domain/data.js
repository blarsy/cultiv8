import { forEach } from 'ramda'

export const nextId = list => {
  let max = 0
  forEach(item => { if(max < item.id) max = item.id }, list)
  return max + 1
}
