import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import migrate from './migrate-db.js'

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => {
  migrate().catch(console.dir)
  console.log('Your Apollo Server is running on port 4000')
})
