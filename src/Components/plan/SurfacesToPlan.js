import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import CulturesSelector from './CulturesSelector'
import PlanInput from './PlanInput'
import { FlexBlock } from '../../toolbox'

class SurfaceToPlan extends React.Component {
  render() {
    if(this.props.data && this.props.data.size > 0) {
      return (
        <FlexBlock isContainer flexFlow='row nowrap'>
          <FlexBlock flex='2 0'>
            <CulturesSelector />
          </FlexBlock>
          <FlexBlock flex='1 0'>
            <PlanInput/>
          </FlexBlock>
        </FlexBlock>
      )
    }
    return <p>No data</p>
  }
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      data: state.global.get('data').get('products')
    }
  }
  return { data: List([]) }
}

export default connect(mapStateToProps)(SurfaceToPlan)
