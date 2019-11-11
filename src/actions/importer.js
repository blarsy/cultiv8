import XLSX from 'xlsx'

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

export default file => (new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, {type: 'array'})

      resolve({
        soles: parseSheet(workbook, 'Soles', ['code','name','rotationIndex']),
        surfaces: parseSheet(workbook, 'Surfaces de culture', ['field','num1','num2']),
        products: parseSheet(workbook, 'Cultures', ['name','family','greediness','productivity','unit','greenhouse','surfaceRatio','surface','greenhouseSurface','sowMin','sowMax','harvestMin','harvestMax'])
      })
    }
    catch(err){
      resolve({ err })
    }
  }
  reader.readAsArrayBuffer(file)
}))
