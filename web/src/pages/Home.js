import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Workfeed } from '../Components'

class Home extends React.Component {
  render() {
    return (
      <section>
        <Workfeed />
      </section>
    )
  }
}

Home.propTypes = {
  profile: PropTypes.object
}

export default connect()(Home)
