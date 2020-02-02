import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Workfeed, DataContent } from '../Components'
import { FlexBlock } from '../toolbox'

class Home extends React.Component {
  render() {
    return (<DataContent><FlexBlock flex="1"><Workfeed /></FlexBlock></DataContent>)
  }
}

Home.propTypes = {
  profile: PropTypes.object
}

export default connect()(Home)
