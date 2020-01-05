import React from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { fromJS } from 'immutable'
import { SelectPlot, DataContent, PlotDisplay } from '../Components'
import { assignCulturesToSurfaces } from '../domain/planner'
import { FlexBlock } from '../toolbox'

class Ground extends React.Component {
  constructor(props) {
    super(props)

    this.data = this.props.data.toJS()
    if(this.data.cultures) assignCulturesToSurfaces(this.data)
  }
  render() {
    const selectedPlot = this.props.state ? this.props.state.get('selectedPlot'): ''
    const displayDate = (this.props.state && this.props.state.get('displayDate')) ? moment(this.props.state.get('displayDate')) : moment(new Date())

    let plotZone

    if(!selectedPlot || !displayDate) {
      plotZone = (<p>Veuillez fournir les infos nécessaires sur la parcelle ci-dessus.</p>)
    } else {
      plotZone = (<PlotDisplay date={displayDate.toISOString()} surfaces={fromJS(this.data.surfaces)} selectedPlot={selectedPlot} />)
    }

    return (
      <DataContent>
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
      </DataContent>
    )
  }
}

const mapStateToProps = state => ({
  state: state.global.get('groundsState'),
  data: state.global.get('data')
})

export default connect(mapStateToProps)(Ground)
