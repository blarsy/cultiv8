import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Workfeed } from '../Components'
import { FlexBlock } from '../toolbox'

class Home extends React.Component {
  render() {
    return (<FlexBlock isContainer flex="1"><Workfeed /></FlexBlock>)
  }
}

Home.propTypes = {
  profile: PropTypes.object
}

export default connect()(Home)
