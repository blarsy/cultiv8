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
          <FlexBlock isContainer flexFlow="row" justifyContent="flex-end" padding="0 0 0.5rem">
            <Button icon="chevron-left" disabled={!hasPlan} onClick={() => this.props.dispatch({ type: 'VOID_CURRENTPLAN' })}>Sélection produits</Button>
            <Button icon="check" disabled={!hasPlan} onClick={() => this.props.dispatch({ type: 'ACCEPT_PLAN' })}>Terminé</Button>
            <Button icon="trash" disabled={!hasPlan} onClick={() => this.props.dispatch({ type: 'RESET_PLAN' })}>Annuler</Button>
          </FlexBlock>
          {content}
        </FlexBlock>
      </DataContent>
    )
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState')
  }
}

export default connect(mapStateToProps)(Plan)
