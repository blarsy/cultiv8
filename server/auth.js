import { DatabaseManager } from '@accounts/database-manager'
import { AccountsModule } from '@accounts/graphql-api'
import { Mongo } from '@accounts/mongo'
import { AccountsPassword } from '@accounts/password'
import { AccountsServer, ServerHooks } from '@accounts/server'
import { client } from './data/db.js'

export default async () => {
  const accountsPassword = new AccountsPassword({
    // This option is called when a new user create an account
    // Inside we can apply our logic to validate the user fields
    validateNewUser: (user) => {
      // For example we can allow only some kind of emails
      // if (user.email.endsWith('.xyz')) {
      //   throw new Error('Invalid email')
      // }
      return user
    },
  })

  await client.connect()
  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: new Mongo(client.db('cultiv8')), tokenSecret: 'qjmfklqjfiomes' },
    {
      password: accountsPassword,
    }
  )

  accountsServer.on(ServerHooks.ValidateLogin, ({ user }) => {
    // This hook is called every time a user try to login.
    // You can use it to only allow users with verified email to login.
    // If you throw an error here it will be returned to the client.
  })

  // Creates resolvers, type definitions, and schema directives used by accounts-js
  const accountsGraphQL = AccountsModule.forRoot({
    accountsServer,
  })

  return accountsGraphQL
}
