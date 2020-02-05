import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FlexBlock } from '../../toolbox'
import PlotDisplay from '../PlotDisplay'
import SuggestionsSelector from './SuggestionsSelector'

class TweakPlan extends React.Component {
  render() {
    const currentPlan = this.props.planState.get('currentPlan')
    const currentRating = currentPlan.get('ratings').get(currentPlan.get('currentRating'))

    let plotZone
    if(!currentRating.get('culture')) {
      plotZone = (<span>Pas de suggestion</span>)
    } else {
      plotZone = (<PlotDisplay
        surfaces={currentPlan.get('surfaces')}
        selectedPlot={this.props.planState.get('selectedPlot')}
        date={moment(currentRating.get('culture').get('plantDate')).toISOString()}/>)
    }
    return (
      <FlexBlock isContainer flexFlow="row">
        <FlexBlock flex='1 0'>
          <SuggestionsSelector />
        </FlexBlock>
        <FlexBlock flex='3 0'>
          { plotZone }
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
