import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { injectGlobal } from 'styled-components'
import { Route, withRouter } from 'react-router-dom'
import { map } from 'ramda'
import { FlexBlock } from './toolbox'
import { Home, DataImport, Culture, Ground, Log, Plan } from './pages'
import MenuRoutes from './MenuRoutes'

import TopMenu from './Components/TopMenu'

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
      <FlexBlock isContainer padding="0.25rem">
        <TopMenu/>
        <FlexBlock flex="1 0" padding="0.5rem">
          <Route exact path="/" component={Home} />
          <Route path="/plan" component={Plan} />
          <Route path="/dataimport" component={DataImport} />
          <Route path="/cultures" component={Culture} />
          <Route path="/grounds" component={Ground} />
          <Route path="/log" component={Log} />
          <Route path="/home" component={Home} />
        </FlexBlock>
      </FlexBlock>
    )
  }
}

App.propTypes = {
  profile: PropTypes.object,
}

export default withRouter(connect()(App))
