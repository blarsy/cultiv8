import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import { AppContextProvider, AppContextConsumer } from './AppContext'
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { FlexBlock, InfoZone, Spinner } from './toolbox'
import { Home, DataImport, Culture, Ground, Log, Plan, Product, Settings } from './pages'
import TopMenu from './Components/TopMenu'
import Modal from './Components/Modal'
import Login from './Components/Login'
import { accountsClient, apolloClient } from './accounts'

const GET_USER_QUERY = gql`
  query getUser {
    getUser {
      id
      username
      emails {
        address
      }
    }
  }
`

class App extends Component {
  constructor(props) {
    super(props)
    this.setContext = value => this.setState(value)
    this.state = { setContext: this.setContext, userLoading: true}

    this.queryUser()
  }

  queryUser() {
    apolloClient.query({query: GET_USER_QUERY, fetchPolicy: "no-cache"
  }).then(user => {
      this.setState( {user: user.data.getUser, userLoading: false} )
    }, err => {
      this.setState( {userLoadError: err, userLoading: false} )
    })
  }

  componentDidMount() {
    injectGlobal`
      html {
        overflow: hidden;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        color: #222;
      }
      input {
        border-radius: 0.25rem;
        border: 1px solid #333;
        padding: 0.25rem;
        font-size: 1.2rem;
        outline-color: #000;
      }
      p {
        margin: 0.25rem 0;
      }
      .react-contextmenu {
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: .25rem;
        color: #373a3c;
        font-size: 16px;
        margin: 2px 0 0;
        min-width: 160px;
        outline: none;
        opacity: 0;
        padding: 5px 0;
        pointer-events: none;
        text-align: left;
        transition: opacity 250ms ease !important;
      }

      .react-contextmenu.react-contextmenu--visible {
        opacity: 1;
        pointer-events: auto;
        z-index: 9999;
      }

      .react-contextmenu-item {
        background: 0 0;
        border: 0;
        color: #373a3c;
      	cursor: pointer;
        font-weight: 400;
        line-height: 1.5;
        padding: 3px 20px;
        text-align: inherit;
        white-space: nowrap;
      }

      .react-contextmenu-item.react-contextmenu-item--active,
      .react-contextmenu-item.react-contextmenu-item--selected {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        text-decoration: none;
      }

      .react-contextmenu-item.react-contextmenu-item--disabled,
      .react-contextmenu-item.react-contextmenu-item--disabled:hover {
        background-color: transparent;
        border-color: rgba(0,0,0,.15);
        color: #878a8c;
      }

      .react-contextmenu-item--divider {
        border-bottom: 1px solid rgba(0,0,0,.15);
        cursor: inherit;
        margin-bottom: 3px;
        padding: 2px 0;
      }
      .react-contextmenu-item--divider:hover {
        background-color: transparent;
        border-color: rgba(0,0,0,.15);
      }

      .react-contextmenu-item.react-contextmenu-submenu {
      	padding: 0;
      }

      .react-contextmenu-item.react-contextmenu-submenu > .react-contextmenu-item {
      }

      .react-contextmenu-item.react-contextmenu-submenu > .react-contextmenu-item:after {
        content: "▶";
        display: inline-block;
        position: absolute;
        right: 7px;
      }
    `
  }

  render() {
    const RootElement = styled.main`
      min-height:100vh;
      max-height: 100vh;
      display: flex;
      flex-flow: column;
    `
    const HorizontalStack = styled.div`
      display: flex;
      padding: 0.25rem;
      flex-flow: row;
      overflow: hidden;
    `

    if(this.state.userLoading) return (
      <FlexBlock isContainer justifyContent="center" padding="2rem">
        <Spinner size={4}/>
      </FlexBlock>
    )
    let content
    if(!this.state.user) {
      content = <Login onLoggedIn={ () => this.queryUser() }/>
    } else {
      content = (<Router>
        <HorizontalStack>
          <TopMenu userName={this.state.user.emails[0].address} onLogOut={ async () => {
              await accountsClient.logout()
              this.setState( {user: null} )
            } }/>
          <FlexBlock isContainer flex="1 0" padding="0.5rem" overflow="hidden">
            <Switch>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/home" component={Home} />
            </Switch>
            <Route path="/plan" component={Plan} />
            <Route path="/dataimport" component={DataImport} />
            <Route path="/cultures" component={Culture} />
            <Route path="/grounds" component={Ground} />
            <Route path="/log" component={Log} />
            <Route path="/products" component={Product} />
            <Route path="/settings" component={Settings} />
          </FlexBlock>
        </HorizontalStack>
        <InfoZone/>
      </Router>
)
    }
    return (
      <RootElement>
        <AppContextProvider value={this.state}>
          { content }
          <AppContextConsumer>
            {context => {
              return context.modal && (<Modal></Modal>)
            }}
          </AppContextConsumer>
        </AppContextProvider>
      </RootElement>
    )
  }
}

App.propTypes = {
  profile: PropTypes.object,
}

export default connect()(App)
