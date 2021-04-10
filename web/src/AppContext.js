import React from 'react'
const {Provider, Consumer} = React.createContext({
  setContext: () => {}
})

export {Provider as AppContextProvider,Consumer as AppContextConsumer}
