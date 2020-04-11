import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map, filter, addIndex, find, reverse, includes } from 'ramda'
import styled from 'styled-components'
import moment from 'moment'
import { FlexBlock } from '../toolbox'
import constants from '../constants'
import { cultureIsActive, forecastStatus } from '../domain/planner'

const Surface = styled(FlexBlock)`
  border: 1px ${props => props.highlighted ? 'dotted' : 'solid'} ${constants.layout.secundaryLight};
  margin: 1px;
  animation: ${props => props.isInsertable && 'glow 0.5s infinite alternate'};
  background: ${props => {
    if(props.status === 0 && !props.highlighted) return `repeating-linear-gradient(
      45deg,
      #66ffc2,
      #66ffc2 10px,
      #fff 10px,
      #fff 20px
    )`
    return 'inherit'
  }};
  background-color: ${props => {
    if(props.highlighted){
      return '#bb99ff'
    } else {
      switch (props.status) {
        case 1:
        case 2:
          return '#ffff1a'
        case 3:
          return '#e67300'
        default:
          return 'inherit'
      }
    }
  }};
  width: 5rem;
  height: 5rem;
  @keyframes glow {
    from {
      box-shadow: 0 0 10px -10px ${constants.layout.secundaryLight};
    }
    to {
      box-shadow: 0 0 10px 10px ${constants.layout.secundaryLight};
    }
  }
`

class PlotDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = { highlightedSurfaces: [] }
  }
  render() {
    this.surfacesInfos = addIndex(map)((surface, idx) => {
      let culture, status
      if(surface.cultures && surface.cultures.length > 0) {
        culture = find(cultureInSurface => cultureIsActive(this.props.date, cultureInSurface, surface), surface.cultures)
        if(!culture) {
          culture = find(culture => moment(culture.plantDate) > moment(this.props.date), surface.cultures)
        }
        if(culture) {
          const currentAndFutureStatusses = forecastStatus(culture)
          const currentStatus = find(historyItem => moment(historyItem.date) <= moment(this.props.date), reverse(currentAndFutureStatusses))
          if(currentStatus) status = currentStatus.status
        }
      }
      return { status, culture, idx, surface }
    }, filter(surface => surface.plot === this.props.selectedPlot, this.props.surfaces.toJS()))
    return (
      <FlexBlock flexFlow="column">
        <FlexBlock isContainer flexFlow="row wrap" flex="1 0">
          {
            map(surfaceInfo => {
              const cultureDetail = surfaceInfo.culture ? (<span>{surfaceInfo.culture.product.name}</span>) : ''
              let header
              if(this.props.editable) header = (<input type="text" value={surfaceInfo.surface.code} name={surfaceInfo.surface.code} onChange={e => this.props.onSurfaceChanged(surfaceInfo.idx, this.props.selectedPlot, e.target.value)}/>)
              else header = (<span>{ surfaceInfo.surface.code }</span>)
              const isHighlighted = includes(surfaceInfo.surface.id, this.state.highlightedSurfaces) &&
                (surfaceInfo.culture.status < 1 || (surfaceInfo.culture.product.nurseryDays > 0 && surfaceInfo.culture.status < 2))
              return (<Surface
                draggable={isHighlighted ? 'true':'false'}
                highlighted={isHighlighted}
                onMouseEnter={e => {
                  if(surfaceInfo.culture) {
                    this.setState({ highlightedSurfaces: surfaceInfo.culture.surfaces })
                  }
                }}
                onDragStart={e => {
                  e.dataTransfer.setData('culture', surfaceInfo.culture.id)}
                }
                onDragEnter={e => {
                  if(!isHighlighted){
                    if(surfaceInfo.culture) {
                      this.setState({ insertSurface: surfaceInfo.culture.surfaces[0] })
                    } else {
                      this.setState({ insertSurface: surfaceInfo.surface.id })
                    }
                  }
                }}
                onDragOver={e => e.preventDefault()}
                onDragExit={() => this.setState({ insertSurface: null })}
                onDragEnd={() => {
                  this.setState({ insertSurface: null })}
                }
                onDrop={e => {
                  this.props.dispatch({ type: 'PLOT_INSERTANDSHIFT_CULTURE', culture: e.dataTransfer.getData('culture'), targetSurface: this.state.insertSurface})
                  this.setState({ insertSurface: null })}
                }
                isContainer
                isInsertable={surfaceInfo.surface.id === this.state.insertSurface}
                flexFlow="column nowrap"
                key={surfaceInfo.idx}
                status={surfaceInfo.status}>
                {header}
                { cultureDetail }
              </Surface>)
            }, this.surfacesInfos)
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

export default connect()(PlotDisplay)
