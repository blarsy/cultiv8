import XLSX from 'xlsx'
import { forEach, find } from 'ramda'
import moment from 'moment'

const parseSheet = (wb, sheetName, targetColNames) => {
  const sheet = wb.Sheets[sheetName]
  const colNames=[]
  for(let j=0; j < targetColNames.length; j++) {
    colNames.push(sheet[XLSX.utils.encode_cell({c: j, r: 0})].v)
  }

  const sheetJson = XLSX.utils.sheet_to_json(sheet)
  const items = []
  for(let i=0; i<sheetJson.length; i++){
    if(sheetJson[i][colNames[0]]) {
      const item = {}
      for(let j=0; j < targetColNames.length; j++) {
        item[targetColNames[j]]=sheetJson[i][colNames[j]]
      }
      items.push(item)
    }
  }
  return items
}

const assignCulturesToSurfaces = (data, datesInIsoFormat) => {
  forEach(culture => {
    let plantDate
    if(datesInIsoFormat) {
      plantDate = moment(culture.plantDate)
    } else {
      plantDate = moment(culture.plantDate, 'L').toDate()
    }
    const product = find(product => product.name === culture.productName, data.products)
    const surface = find(surface => culture.plot === surface.plot && culture.code === surface.code, data.surfaces)
    if(!surface.cultures) surface.cultures = []
    surface.cultures.push({
      product,
      plantDate,
      status: culture.status
    })
    culture.plantDate = plantDate
  }, data.cultures)
}

export const fromJson = file => (new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result)
      assignCulturesToSurfaces(data, true)
      resolve(data)
    }
    catch(err){
      resolve({ err })
    }
  }
  reader.readAsText(file)
}))

export const fromSpreadsheet = file => (new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, {type: 'array'})

      const result = {
        soles: parseSheet(workbook, 'Soles', ['code','name','rotationIndex']),
        surfaces: parseSheet(workbook, 'Surfaces de culture', ['plot','code']),
        plots: parseSheet(workbook, 'Parcelles', ['code','name']),
        products: parseSheet(workbook, 'Produits', [
          'name','family','greediness','productivity','unit','greenhouse','surfaceRatio',
          'surface','greenhouseSurface','sowMin','sowMax','growingDays','nurseryDays','harvestDays',
          'totalWorkHours', 'plantsPerSqMeter','totalNumberOfPlants','priceOrganic','actualPrice',
          'incomePerSqMeter','totalIncome','incomePerWorkHour','soilOccupationRatio', 'amountOfWorkRatio',
          'interestRatio']),
        cultures: parseSheet(workbook, 'Cultures', ['productName', 'status', 'plantDate', 'plot', 'code'])
      }

      assignCulturesToSurfaces(result, false)

      resolve(result)
    }
    catch(err){
      resolve({ err })
    }
  }
  reader.readAsArrayBuffer(file)
}))
