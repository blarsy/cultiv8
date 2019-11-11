import React from 'react'
import { connect } from 'react-redux'
import { Button } from '../toolbox'

class Ground extends React.Component {
  render() {
    return (
      <section>
        Grounds
      </section>
    )
  }
}

export default connect()(Ground)
