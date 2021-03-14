import mongodb from 'mongodb'
import { map, forEach } from 'ramda'
import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./data.json'))
const { MongoClient } = mongodb
const uri =
  "mongodb://root:password123@db"
const client = new MongoClient(uri)

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function run() {
  try {
    let loop
    do {
      try {
        loop = false
        await client.connect()
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

    const db = client.db('cultiv8')
    const farm = db.collection('farm')
    const theFarm = await farm.findOne({})
    if(!theFarm) {
      await db.addUser('cultiv8app', 'password123', {
        roles: [{
          role : 'readWrite',
          db   : 'cultiv8'
        }]
      })
      await importData(db)
    }
  } finally {
    await client.close()
  }
}

async function importData(db) {
  const theFarm = {
    name: 'Le comptoir fermier du Rosoir',
    dataschemeVersion: data.settings.dataschemeVersion,
    surfaceSize: data.settings.surfaceSize,
    totalSurface: data.settings.totalSurface
  }
  const farm = db.collection('farm')
  const result = await farm.insertOne(theFarm)
  await db.collection('plot').insertMany(map(plot => ({ farm: result.insertedId, ...plot }), data.plots))
  const plotIdsByCode = {}
  await db.collection('plot').find({}).forEach(plot => {
    plotIdsByCode[plot.code] = plot._id
  })
  await db.collection('surface').insertMany(map(surface => {
    return { code: surface.code, oldId: surface.id, plot: plotIdsByCode[surface.plot] }
  }, data.surfaces))
  await db.collection('product').insertMany(map(product => ({...product, farm: result.insertedId}), data.products))
  const productIdsByName = {}
  await db.collection('product').find({},{projection: { name: 1, _id: 1 }}).forEach(product => {
    productIdsByName[product.name] = product._id
  })
  const surfaceIdsByOldId = {}
  await db.collection('surface').find({}, {projection: { _id: 1, oldId: 1 }}).forEach(surface => {
    surfaceIdsByOldId[surface.oldId] = surface._id
  })
  await db.collection('culture').insertMany(map(culture => ({
    oldId: culture.id,
    product: productIdsByName[culture.productName],
    status: culture.status,
    plantDate: culture.plantDate,
    surfaces: map(surface => surfaceIdsByOldId[surface], culture.surfaces)
  }), data.cultures))
  const cultureIdsByOldId = {}
  await db.collection('culture').find({}, {projection: {oldId: 1, _id:1}}).forEach(culture => {
    cultureIdsByOldId[culture.oldId] = culture._id
  })
  await db.collection('task').insertMany(map(task => ({
    type: task.type,
    date: task.date,
    creation: task.creation,
    culture: cultureIdsByOldId[task.cultureId]
  }), data.tasks))
  await db.collection('logTag').insertMany(map(logTag => ({ farm: result.insertedId, name: logTag }), data.logTags))
  const logTagIdsByName = {}
  await db.collection('logTag').find({}).forEach(logTag => {
    logTagIdsByName[logTag.name] = logTag._id
  })
  console.log(logTagIdsByName)
  await db.collection('log').insertMany(map(log => ({
    date: log.date,
    description: log.description,
    tags: map(tag => logTagIdsByName[tag], log.tags),
    cultures: map(culture => cultureIdsByOldId[culture], log.cultures),
    surfaces: map(surface => surfaceIdsByOldId[surface], log.surfaces)
  }), data.log))
  // erase culture.oldId, surface.oldId
}
