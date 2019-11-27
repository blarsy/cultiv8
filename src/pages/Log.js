import React from 'react'
import { connect } from 'react-redux'

class Log extends React.Component {
  render() {
    return (
      <section>
        Logs
      </section>
    )
  }
}

export default connect()(Log)
