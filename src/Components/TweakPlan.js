import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { FlexBlock } from '../toolbox'
import { PlotDisplay, SuggestionsSelector } from '.'

class TweakPlan extends React.Component {
  render() {
    return (
      <FlexBlock isContainer flexFlow="row">
      <FlexBlock flex='1 0'>
        <SuggestionsSelector />
      </FlexBlock>
      <FlexBlock flex='3 0'>
        <PlotDisplay />
      </FlexBlock>
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState')
  }
}

export default connect(mapStateToProps)(TweakPlan)
