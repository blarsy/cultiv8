import mongodb from 'mongodb'
import { importData } from './migrate.js'

const { MongoClient } = mongodb
const mongoServerName = "localhost" //"db"
const adminUri =
  `mongodb://root:password123@${mongoServerName}`
const uri =
  `mongodb://cultiv8app:password123@${mongoServerName}/?authSource=cultiv8`
export const client = new MongoClient(uri)

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startUp() {
  const adminClient = new MongoClient(adminUri)
  try {
    let loop
    do {
      try {
        loop = false
        await adminClient.connect()
      }
      catch(connectError) {
        if (connectError.name === 'MongoNetworkError') {
          await(delay(1000))
          loop = true
        } else {
          throw connectError
        }
      }
    } while(loop)

    console.log('Connected...')

    const db = adminClient.db('cultiv8')
    const farm = db.collection('farm')
    const theFarm = await farm.findOne({})
    if(!theFarm) {
      console.log('No data found, importing ...')
      await importData(db)
      console.log('Import completed.')
    } else {
      console.log('Data present, no import neded.')
    }
  } finally {
    await adminClient.close()
  }
}
