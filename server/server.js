import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import { run, client} from './db.js'
import Tasks from './dataSources/Tasks.js'
import Farms from './dataSources/Farms.js'
import Cultures from './dataSources/Cultures.js'

const app = express()

const runApp = async () => {
  await app.listen({ port: 4000 })
  try {
    await run()
    try {
      await client.connect()
      const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
          tasks: new Tasks(client.db('cultiv8').collection('task')),
          farms: new Farms(client.db('cultiv8').collection('farm')),
          cultures: new Cultures(client.db('cultiv8').collection('culture'))
        })})
      server.applyMiddleware({ app })
      console.log('Your Apollo Server is running on port 4000')
    }
    catch(err){
      console.log (err)
    }
  }
  catch(err){
    console.log (err)
  }
}

runApp().catch(err => console.log (err))
