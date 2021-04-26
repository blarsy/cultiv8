import React, { useState } from 'react'
import { accountsClient } from '../accounts'
import { Button, FlexBlock, ValidatedForm } from './../toolbox'

export default ({ onLoggedIn }) => {
  const [ processing, setProcessing ] = useState(false)
  const [ error, setError] = useState(null)
  return (<FlexBlock isContainer flexFlow="column">
      <ValidatedForm
        initialState={{}}
        processing={processing}
        lastError={error}
        margin="10%"
        inputs={[
          {
            type: 'text',
            name: 'email',
            label: 'Email',
            required: true
          },
          {
            type: 'password',
            name: 'password',
            label: 'Password',
            required: true
          },
        ]}
        onSubmit={async formData => {
          try {
            setProcessing(true)
            await accountsClient.loginWithService('password', {
              user: {
                email: formData.email,
              },
              password: formData.password,
            })
            onLoggedIn()
          }
          catch(err) {
            setError(err.message)
          }
          setProcessing(false)
        }}
        actionLabel="Ok"
        title="Connection"/>
    </FlexBlock>)
}
