const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = './schema'
const { resolvers } = './resolvers'

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => {
    console.log('Your Apollo Server is running on port 4000')
})
