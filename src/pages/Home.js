import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Workfeed, DataContent } from '../Components'

class Home extends React.Component {
  render() {
    return (<DataContent><Workfeed /></DataContent>)
  }
}

Home.propTypes = {
  profile: PropTypes.object
}

export default connect()(Home)
