import React from 'react'
import { connect } from 'react-redux'
import { SurfacesToPlan, TweakPlan, DataContent } from '../Components'
import { FlexBlock, Button } from '../toolbox'

class Plan extends React.Component {
  render() {
    let content
    const hasPlan = this.props.planState && this.props.planState.get('currentPlan')
    if(!hasPlan) {
      content = <SurfacesToPlan />
    } else {
      content = <TweakPlan />
    }
    return (
      <DataContent>
        <FlexBlock isContainer flexFlow="column" alignItems="stretch">
          <FlexBlock isContainer flexFlow="row" justifyContent="flex-end">
            <Button disabled={!hasPlan} onClick={() => this.props.dispatch({ type: 'RESET_PLAN', data: this.props.data })}>Annuler le plan</Button>
          </FlexBlock>
          {content}
        </FlexBlock>
      </DataContent>
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
