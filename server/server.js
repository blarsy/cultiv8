import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import { startUp, client} from './data/db.js'
import Tasks from './dataSources/Tasks.js'
import Farms from './dataSources/Farms.js'
import Cultures from './dataSources/Cultures.js'
import Products from './dataSources/Products.js'
import Surfaces from './dataSources/Surfaces.js'
import Plots from './dataSources/Plots.js'
import setup from './auth.js'

const app = express()

const runApp = async () => {
  const corsConfig = cors()
  app.use(corsConfig)
  app.options('*', corsConfig)
  await app.listen({ port: 4000 })
  try {
    await startUp()
    try {
      await client.connect()
      const db = client.db('cultiv8')
      const farmsDataSource = new Farms(db.collection('farm'))
      const accountsGraphQL = await setup()
      const server = new ApolloServer({
        typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
        resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
        dataSources: () => ({
          tasks: new Tasks(db.collection('task')),
          farms: farmsDataSource,
          cultures: new Cultures(db.collection('culture')),
          products: new Products(db.collection('product')),
          surfaces: new Surfaces(db.collection('surface')),
          plots: new Plots(db.collection('plot'))
        }),
        context: accountsGraphQL.context,
        schemaDirectives: {
          ...accountsGraphQL.schemaDirectives,
        }
      })
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
