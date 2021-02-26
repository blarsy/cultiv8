
db.auth('root', 'password123')
var appDb = db.getSiblingDB('cultiv8')
var idRosoir = ObjectId()
var fileContent = cat('./data.json')
var data = JSON.parse(fileContent)
appDb.farm.insert({
  id: idRosoir,
  name: 'Le comptoir fermier du Rosoir',
  dataschemeVersion: data.settings.dataschemeVersion,
  surfaceSize: data.settings.surfaceSize,
  totalSurface: data.settings.totalSurface
})

// appDb.plot.insert({
//   id: ObjectId(),
//   farm: idRosoir,
//   code: 'BF',
//   name: 'Bon-Secours fond'
// })
appDb.createUser({
    user: 'cultiv8app',
    pwd: 'password123',
    roles: [
      {
        role: "readWrite",
        db: "cultiv8"
      }
    ]
  })
