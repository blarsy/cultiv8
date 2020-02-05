import React from 'react'
import { map, forEachObjIndexed, reduce, filter } from 'ramda'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { Button, FlexBlock } from '../../toolbox'
import SelectPlot from '../SelectPlot'
import Select from 'react-select'

const STANDARD_SURFACE = 10

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
          {selectedCultures.length > 0 && (<p>{selectedCultures.length} cultures sélectionnées.</p>)}
          {planState.selectedPlot && (<p>Surface disponible: {reduce((acc, surface) => acc + STANDARD_SURFACE, 0, filter(surface => surface.plot === planState.selectedPlot, this.props.surfaces.toJS()))}.</p>)}
          {selectedCultures.length > 0 && (<p>Surface requise: {reduce((acc, culture) => acc + culture.surface, 0, selectedCultures)}.</p>)}
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
      <p>Priorité de placement</p>
      <Select name="order"
        value={planState.selectedPriority || null}
        onChange={e => this.props.dispatch({ type: 'PLANMAKE_SELECTPRIORITY', priority: e.value})}
        options={[
          { value: 'plantDate_asc', label: 'Prochaines dates de plantation' },
          { value: 'greediness_asc', label: 'Les plus gourmands en premier' },
          { value: 'greediness_desc', label: 'Les moins gourmands en premier' },
          { value: 'family_asc', label: 'Familles groupées' }
        ]}
        clearable={false} />
      {selectionDetails}
    </FlexBlock>)
  }
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      plots: state.global.get('data').get('plots'),
      planState: state.global.get('planState'),
      surfaces: state.global.get('data').get('surfaces')
    }
  }
  return { plots: List([]) }
}
export default connect(mapStateToProps)(PlanInput)
