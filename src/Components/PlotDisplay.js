import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { map, filter, addIndex, find, findIndex, reverse, includes } from 'ramda'
import styled from 'styled-components'
import moment from 'moment'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { push } from 'react-router-redux'
import { FlexBlock } from '../toolbox'
import Table from './Table'
import constants from '../constants'
import { cultureIsActive, forecastStatus } from '../domain/planner'

const Surface = styled(FlexBlock)`
  border: 1px solid ${constants.layout.secundaryLight};
  outline: ${props => props.detailed ? '4px solid ' + constants.layout.secundaryLight : '0'};
  outline-offset: ${props => props.detailed ? '-4px' : '0'};
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
const SurfaceContent = styled(FlexBlock)`
  margin: ${props => props.detailed ? '4px' : '0'};
`

class PlotDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = { highlightedSurfaces: [] }
  }
  render() {
    const surfaces = this.props.surfaces
    const disableDragAndDrop = this.props.disableDragAndDrop
    const menuId = 'surfaceContextMenu'
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
    }, filter(surface => surface.plot === this.props.selectedPlot, surfaces))
    const surfaceDetailed = this.props.surfaceDetailed && this.props.surfaceDetailed.toJS()
    return (
      <FlexBlock isContainer flexFlow="column">
        <ContextMenu id={menuId}>
          <MenuItem disabled={!this.state.currentSurfaceInfo || !this.state.currentSurfaceInfo.culture} onClick={e => {
              this.props.dispatch({ type: 'BEGIN_EDIT_CULTURE', data: this.state.currentSurfaceInfo.culture})
              this.props.dispatch(push('/cultures'))
            }}>
            Editer
          </MenuItem>
          <MenuItem onClick={e => this.props.dispatch({ type: 'SELECT_SURFACE_FOR_DETAILS', surface: this.state.currentSurfaceInfo.surface})}>
            Historique cultures
          </MenuItem>
        </ContextMenu>

        <FlexBlock isContainer flexFlow="column" overflow="hidden">
          <FlexBlock isContainer flexFlow="row wrap" flex="2 0" overflow="auto">
            {
              map(surfaceInfo => {
                const cultureDetail = surfaceInfo.culture ? (<span>{surfaceInfo.culture.product.name}</span>) : ''
                let header
                if(this.props.editable) header = (<input type="text" value={surfaceInfo.surface.code} name={surfaceInfo.surface.code} onChange={e => this.props.onSurfaceChanged(surfaceInfo.idx, this.props.selectedPlot, e.target.value)}/>)
                else header = (<span>{ surfaceInfo.surface.code }</span>)
                const isHighlighted = (includes(surfaceInfo.surface.id, this.state.highlightedSurfaces) &&
                  (surfaceInfo.culture.status < 1 || (surfaceInfo.culture.product.nurseryDays > 0 && surfaceInfo.culture.status < 2)))
                  || (this.props.selectedSurfaces && includes(surfaceInfo.surface.id, this.props.selectedSurfaces))
                const isDetailed = this.props.surfaceDetailed && this.props.surfaceDetailed.get('code') === surfaceInfo.surface.code
                return (<ContextMenuTrigger key={surfaceInfo.idx} id={menuId} disable={this.state.dragging}>
                  <Surface
                    draggable={!disableDragAndDrop && isHighlighted ? 'true':'false'}
                    highlighted={isHighlighted}
                    detailed={isDetailed}
                    onMouseEnter={e => {
                      if(!disableDragAndDrop) {
                        this.setState({ currentSurfaceInfo: surfaceInfo })
                        if(surfaceInfo.culture) {
                          this.setState({ highlightedSurfaces: surfaceInfo.culture.surfaces })
                        }
                      }
                    }}
                    onDragStart={e => {
                      if(!disableDragAndDrop) {
                        e.dataTransfer.setData('culture', surfaceInfo.culture.id)}
                        let amountContiguousSurfaces = 1
                        const currentSurfaceIndex = this.surfacesInfos.indexOf(surfaceInfo)
                        while(currentSurfaceIndex + amountContiguousSurfaces <= this.surfacesInfos.length &&
                          this.surfacesInfos[currentSurfaceIndex + amountContiguousSurfaces].culture &&
                          this.surfacesInfos[currentSurfaceIndex + amountContiguousSurfaces].culture.id === this.surfacesInfos[currentSurfaceIndex].culture.id){
                          amountContiguousSurfaces ++
                        }
                        this.setState({ dragging: true, action: { culture: surfaceInfo.culture, originSurface: surfaceInfo.surface, amountSurfaces: amountContiguousSurfaces } })
                      }
                    }
                    onDragEnter={e => {
                      if(!disableDragAndDrop) {
                        if(!isHighlighted){
                          let spaceAvailable = true
                          let counter = 0
                          let currentSurfaceIndex = this.surfacesInfos.indexOf(surfaceInfo)
                          do {
                            if(this.surfacesInfos[currentSurfaceIndex].culture){
                              spaceAvailable = false
                              break
                            }
                            currentSurfaceIndex ++
                            counter ++
                          }
                          while(counter < this.state.action.amountSurfaces && currentSurfaceIndex <= this.surfacesInfos.length)
                          if(spaceAvailable) {
                            this.setState({ insertSurface: surfaceInfo.surface.id })
                          }
                        } else {
                          this.setState({ insertSurface: null })
                        }
                      }
                    }}
                    onDragOver={e => {
                      if(!disableDragAndDrop) {
                        e.preventDefault()}
                      }
                    }
                    onDragExit={() => {
                      if(!disableDragAndDrop) {
                        this.setState({ insertSurface: null, dragging: false, action: null })}
                      }
                    }
                    onDragEnd={() => {
                      if(!disableDragAndDrop) {
                        this.setState({ insertSurface: null, dragging: false, action: null })}
                      }
                    }
                    onDrop={e => {
                      if(!disableDragAndDrop && this.state.insertSurface) {
                        const cultureToModify = this.state.action.culture
                        let originSurfaceIndex = findIndex(surface => surface === this.state.action.originSurface.id, cultureToModify.surfaces)
                        let targetSurfaceIndex = findIndex(surfaceInfo => surfaceInfo.surface.id === this.state.insertSurface, this.surfacesInfos)
                        for (let i=0; i<this.state.action.amountSurfaces; i ++){
                          cultureToModify.surfaces[originSurfaceIndex + i] = this.surfacesInfos[targetSurfaceIndex + i].surface.id
                        }
                        this.props.onCultureMoved(cultureToModify)
                        this.setState({ insertSurface: null, dragging: false, action: null })}
                      }
                    }
                    isContainer
                    isInsertable={surfaceInfo.surface.id === this.state.insertSurface}
                    flexFlow="column nowrap"
                    status={surfaceInfo.status}>
                    <SurfaceContent detailed={isDetailed}
                      isContainer
                      flexFlow="column nowrap">
                      {header}
                      { cultureDetail }
                    </SurfaceContent>
                  </Surface>
                </ContextMenuTrigger>)
              }, this.surfacesInfos)
            }
          </FlexBlock>
          { surfaceDetailed &&
            <FlexBlock isContainer flex="1 0" flexFlow="column" overflow="hidden">
              Historique cultures pour la surface {surfaceDetailed.code}
              <Table data={surfaceDetailed.cultures || []} dataColumns={[
                  {
                    title: 'Produit',
                    content: culture => culture.product.name,
                    flex: '1 0'
                  },
                  {
                    title: 'Date plantation',
                    content: culture => moment(culture.plantDate).format('L'),
                    flex: '1 0'
                  }
                ]}/>
            </FlexBlock>
          }
        </FlexBlock>
      </FlexBlock>
    )
  }
}

PlotDisplay.propTypes = {
  date: PropTypes.string,
  surfaces: PropTypes.arrayOf(PropTypes.object),
  selectedPlot: PropTypes.string,
  surfaceDetailed: PropTypes.object,
  editable: PropTypes.bool,
  onSurfaceChanged: PropTypes.func,
  onCultureMoved: PropTypes.func,
  disableDragAndDrop: PropTypes.bool,
  selectedSurfaces: PropTypes.arrayOf(PropTypes.number)
}

const mapStateToProps = state => ({
  surfaceDetailed: state.global.get('groundsState') && state.global.get('groundsState').get('surfaceDetailed')
})

export default connect(mapStateToProps)(PlotDisplay)
