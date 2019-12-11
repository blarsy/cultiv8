import React from 'react'
import { connect } from 'react-redux'
import { FlexBlock } from '../toolbox'

class PlotDisplay extends React.Component {
  render() {
    return (
      <FlexBlock isContainer flexFlow="row">
        PlotDisplay
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState')
  }
}

export default connect(mapStateToProps)(PlotDisplay)
