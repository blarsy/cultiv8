import React from 'react'
import { connect } from 'react-redux'
import { Button } from '../toolbox'

class Surface extends React.Component {
  render() {
    return (
      <section>
        Surfaces
      </section>
    )
  }
}

export default connect()(Surface)
