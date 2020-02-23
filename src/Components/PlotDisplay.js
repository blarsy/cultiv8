import React from 'react'
import PropTypes from 'prop-types'
import { map, filter, addIndex, find, reverse } from 'ramda'
import styled from 'styled-components'
import moment from 'moment'
import { FlexBlock } from '../toolbox'
import constants from '../constants'
import { cultureIsActive, forecastStatus } from '../domain/planner'

const Surface = styled(FlexBlock)`
  border: 1px solid ${constants.layout.secundaryLight};
  background: ${props => {
    if(props.status === 0) return `repeating-linear-gradient(
      45deg,
      #66ffc2,
      #66ffc2 10px,
      #fff 10px,
      #fff 20px
    )`
    return 'inherit'
  }};
  background-color: ${props => {
    switch (props.status) {
      case 1:
      case 2:
        return '#ffff1a'
      case 3:
        return '#e67300'
      default:
        return 'inherit'
    }
  }};
  margin: 1px;
  width: 5rem;
  height: 5rem;
`

class PlotDisplay extends React.Component {
  render() {
    return (
      <FlexBlock flexFlow="column">
        <FlexBlock isContainer flexFlow="row wrap" flex="1 0">
          {
            addIndex(map)((surface, idx) => {
              let cultureDetail, culture, status
              if(surface.cultures && surface.cultures.length > 0) {
                culture = find(cultureInSurface => cultureIsActive(this.props.date, cultureInSurface), surface.cultures)
                if(!culture) {
                  culture = find(culture => moment(culture.plantDate) > moment(this.props.date), surface.cultures)
                }
                if(culture) {
                  const currentAndFutureStatusses = forecastStatus(culture)
                  const currentStatus = find(historyItem => moment(historyItem.date) <= moment(this.props.date), reverse(currentAndFutureStatusses))
                  if(currentStatus) status = currentStatus.status
                }
              }
              cultureDetail = culture ? (<span>{culture.product.name}</span>) : ''
              let header
              if(this.props.editable) header = (<input type="text" value={surface.code} name={surface.code} onChange={e => this.props.onSurfaceChanged(idx, this.props.selectedPlot, e.target.value)}/>)
              else header = (<span>{ surface.code }</span>)
              return (<Surface isContainer flexFlow="column nowrap" key={idx} status={status}>
                {header}
                { cultureDetail }
              </Surface>)
            },
            filter(surface => surface.plot === this.props.selectedPlot, this.props.surfaces.toJS()))
          }
        </FlexBlock>
      </FlexBlock>
    )
  }
}

PlotDisplay.propTypes = {
  date: PropTypes.string,
  surfaces: PropTypes.object,
  selectedPlot: PropTypes.string,
  editable: PropTypes.bool,
  onSurfaceChanged: PropTypes.func
}

export default PlotDisplay
