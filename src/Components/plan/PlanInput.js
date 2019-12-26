import React from 'react'
import { map, forEachObjIndexed } from 'ramda'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { Button, FlexBlock } from '../../toolbox'
import SelectPlot from '../SelectPlot'

class PlanInput extends React.Component {
  render() {
    const selectedCultures = []
    const planState = this.props.planState.toJS()
    let selectionDetails
    forEachObjIndexed(
      (val, key) => {
        if(val.selected){
          selectedCultures.push({ name: key, surface: val.surface})
        }
      }, planState.selections)

    if(selectedCultures.length > 0) {
      const selectionList = map(selection => (
        <FlexBlock isContainer flex="1 0" flexFlow="row nowrap" padding="0.25rem 0" key={selection.name}>
          <FlexBlock flex='1 0'>{selection.name}</FlexBlock>
          <FlexBlock flex='0 1'>{selection.surface.toFixed(1)}</FlexBlock>
        </FlexBlock>
      ), selectedCultures)
      selectionDetails = (<FlexBlock isContainer padding="0.5rem" flex="1 0" flexFlow="column" alignItems="stretch" justifyContent="space-between">
          <Button disabled={!planState.selectedPlot} onClick={() => this.props.dispatch({ type: 'PLANMAKE_SUGGEST' })}>Suggérer un plan</Button>
          <FlexBlock isContainer flex="1 0" flexFlow='row nowrap' padding="0.25rem 0">
            <FlexBlock flex='1 0'>Culture</FlexBlock>
            <FlexBlock flex='0 1'>Surface</FlexBlock>
          </FlexBlock>
          {selectionList}
        </FlexBlock>)
    } else {
      selectionDetails = <FlexBlock isContainer justifyContent="center" padding="0.5rem"><span>Aucune sélection de culture</span></FlexBlock>
    }
    return (<FlexBlock isContainer flexFlow='column nowrap' padding="0.25rem">
      <p>Parcelle visée</p>
      <SelectPlot value={planState.selectedPlot} onChange={value =>
        this.props.dispatch({ type: 'PLANMAKE_SETSELECTEDPLOT', plot: value})}></SelectPlot>
      {selectionDetails}
    </FlexBlock>)
  }
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      plots: state.global.get('data').get('plots'),
      planState: state.global.get('planState')
    }
  }
  return { plots: List([]) }
}
export default connect(mapStateToProps)(PlanInput)