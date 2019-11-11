import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import { Home, DataImport, Culture, Ground, Log, Surface, Plan } from './pages'
import { Route, withRouter } from 'react-router-dom'

import TopMenu from './Components/TopMenu'

const AppContainer = styled.section`
  max-width: 950px;
  margin: auto;
`

class App extends Component {
  componentDidMount() {
    injectGlobal`
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
    `
  }

  render() {
    return (
      <AppContainer>
        <TopMenu/>
        <Route exact path="/" component={Home} />
        <Route path="/plan" component={Plan} />
        <Route path="/dataimport" component={DataImport} />
        <Route path="/cultures" component={Culture} />
        <Route path="/grounds" component={Ground} />
        <Route path="/surfaces" component={Surface} />
        <Route path="/log" component={Log} />
        <Route path="/home" component={Home} />
      </AppContainer>
    )
  }
}

App.propTypes = {
  profile: PropTypes.object,
}

export default withRouter(connect()(App))
