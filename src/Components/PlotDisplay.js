import React from 'react'
import PropTypes from 'prop-types'
import { map, filter, addIndex, find } from 'ramda'
import styled from 'styled-components'
import { FlexBlock } from '../toolbox'
import constants from '../constants'
import { cultureIsActive } from '../domain/planner'

const Surface = styled(FlexBlock)`
  border: 1px solid ${constants.layout.secundaryLight};
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
              let cultureDetail
              if(surface.cultures && surface.cultures.length > 0) {
                const culture = find(cultureInSurface => cultureIsActive(this.props.date, cultureInSurface), surface.cultures)
                if(culture) {
                  cultureDetail = (<span>{culture.product.name}</span>)
                }
              }
              return (<Surface isContainer flexFlow="column nowrap" key={idx}>
                <span>{ surface.code }</span>
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
  selectedPlot: PropTypes.string
}

export default PlotDisplay
