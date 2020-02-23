import React from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { fromJS } from 'immutable'
import { any, find, filter, forEach } from 'ramda'
import { SelectPlot, DataContent, PlotDisplay, EditPlot } from '../Components'
import { assignCulturesToSurfaces } from '../domain/planner'
import { FlexBlock, Button } from '../toolbox'

class Ground extends React.Component {
  constructor(props) {
    super(props)

    if(this.props.data) {
      this.data = this.props.data.toJS()
      if(this.data.cultures) assignCulturesToSurfaces(this.data)
    }

    this.state = { updatedSurfaces: {}, surfaces: fromJS(this.data.surfaces) }
  }

  registerUpdatedSurfaceCode(surfaceIndex, targetPlot, newCode) {
    const updatedSurfaces = [...this.state.updatedSurfaces ]
    const plotSurfaces = filter(surface => surface.plot === targetPlot, this.data.surfaces)
    if(!any(updatedSurface => updatedSurface.index === surfaceIndex,updatedSurfaces)) updatedSurfaces.push({index: surfaceIndex, code: newCode})
    else find(updatedSurface => updatedSurface.index === surfaceIndex, updatedSurfaces).code = newCode

    forEach(updatedSurface => plotSurfaces[updatedSurface.index].code = updatedSurface.code, updatedSurfaces)
    this.setState({ updatedSurfaces, surfaces: fromJS(this.data.surfaces) })
  }

  render() {
    const state = this.props.state ? this.props.state.toJS() : null
    const selectedPlot = state && state.selectedPlot
    const editedPlot = state && state.editedPlot
    let plotHasCultures = false
    if(selectedPlot){
      plotHasCultures = any(surface => surface.plot === selectedPlot && surface.cultures && surface.cultures.length > 0, this.data.surfaces)
    }

    let content
    if(editedPlot){
      content = (<EditPlot onEditDone={data => this.props.dispatch({ type: 'SAVE_PLOT', data })}/>)
    } else {
      const displayDate = (state && state.displayDate) ? moment(state.displayDate) : moment(new Date())

      let plotZone

      if(!selectedPlot || !displayDate) {
        plotZone = (<p>Veuillez fournir les infos nécessaires sur la parcelle ci-dessus.</p>)
      } else {
        plotZone = (<PlotDisplay
          editable={state.editingSurface}
          onSurfaceChanged={(surfaceIndex, targetPlot, newCode) => this.registerUpdatedSurfaceCode(surfaceIndex, targetPlot, newCode)}
          date={displayDate.toISOString()}
          surfaces={this.state.surfaces}
          selectedPlot={selectedPlot} />)
      }

      content = (<FlexBlock>
        <FlexBlock isContainer justifyContent="space-around">
          <FlexBlock isContainer flexFlow="column" padding="0 0 1rem">
            <p>Sélectionnez la parcelle à visualiser:</p>
            <SelectPlot value={selectedPlot} onChange={value => this.props.dispatch({ type: 'GROUND_SELECTPLOT', value})} />
          </FlexBlock>
          <FlexBlock isContainer flexFlow="column">
            <p>Date à visualiser:</p>
            <DatePicker popperPlacement="bottom" popperModifiers={{
              preventOverflow: {
                enabled: true,
                escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                boundariesElement: 'viewport'
              }
            }} selected={displayDate} onChange={value => this.props.dispatch({ type: 'GROUND_CHANGEDISPLAYDATE', value})} />
          </FlexBlock>
          </FlexBlock>
          <FlexBlock isContainer flex="1 0" justifyContent="center">
          {plotZone}
          </FlexBlock>
        </FlexBlock>)
    }

    return (
      <DataContent>
        <FlexBlock isContainer flexFlow="column" flex="1">
          <FlexBlock>
            <Button icon="plus" disabled={!!editedPlot} onClick={() => this.props.dispatch({ type: 'TOGGLE_PLOT_CREATION' })}>Ajouter</Button>
            <Button icon="pencil" disabled={!selectedPlot || !!editedPlot} onClick={() => this.props.dispatch({ type: 'TOGGLE_PLOT_EDITION' })}>Modifier</Button>
            {!editedPlot && (<Button icon="trash" disabled={!selectedPlot || plotHasCultures} onClick={() => this.props.dispatch({ type: 'REMOVE_PLOT' })}>Supprimer</Button>)}
            {editedPlot && (<Button icon="chevron-left" disabled={!selectedPlot} onClick={() => this.props.dispatch({ type: 'TOGGLE_PLOT_EDITION' })}>Annuler</Button>)}
            {selectedPlot && any(surface => surface.plot === selectedPlot, this.data.surfaces) && !state.editingSurface &&
              (<Button icon="grid-three-up" onClick={() => this.props.dispatch({ type: 'TOGGLE_SURFACE_EDITION'})}>Edition surfaces</Button>)}
            {selectedPlot && any(surface => surface.plot === selectedPlot, this.data.surfaces) && state.editingSurface &&
              (<Button icon="grid-three-up" onClick={() => this.props.dispatch({ type: 'TOGGLE_SURFACE_EDITION', data: this.state.updatedSurfaces })}>Sauver surfaces</Button>)}
          </FlexBlock>
          {content}
        </FlexBlock>
      </DataContent>
    )
  }
}

const mapStateToProps = state => ({
  state: state.global.get('groundsState'),
  data: state.global.get('data')
})

export default connect(mapStateToProps)(Ground)
