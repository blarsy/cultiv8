import React from 'react'
import { connect } from 'react-redux'
import { SurfacesToPlan, TweakPlan } from '../Components'
import { FlexBlock, Button } from '../toolbox'

class Plan extends React.Component {
  render() {
    let content
    if(!this.props.planState || !this.props.planState.get('currentPlan')) {
      content = <SurfacesToPlan />
    } else {
      content = <TweakPlan />
    }
    return (
      <FlexBlock isContainer flexFlow="column" alignItems="stretch">
        <FlexBlock isContainer flexFlow="row" justifyContent="flex-end">
          <Button disabled={!this.props.planState} onClick={() => this.props.dispatch({ type: 'RESET_PLAN', data: this.props.data })}>Annuler le plan</Button>
        </FlexBlock>
        {content}
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState'),
    data: state.global.get('data')
  }
}

export default connect(mapStateToProps)(Plan)
