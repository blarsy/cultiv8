import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { FlexBlock } from '../../toolbox'
import PlotDisplay from '../PlotDisplay'
import SuggestionsSelector from './SuggestionsSelector'

class TweakPlan extends React.Component {
  render() {
    const currentPlan = this.props.planState.get('currentPlan')
    const currentRating = currentPlan.get('ratings').get(currentPlan.get('currentRating'))

    return (
      <FlexBlock isContainer flexFlow="row">
        <FlexBlock flex='1 0'>
          <SuggestionsSelector />
        </FlexBlock>
        <FlexBlock flex='3 0'>
          <PlotDisplay surfaces={currentPlan.get('surfaces')} selectedPlot={this.props.planState.get('selectedPlot')} date={currentRating.get('culture').get('plantDate')}/>
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
