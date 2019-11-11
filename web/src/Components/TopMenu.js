import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import { TinyLogo, Button } from '../toolbox'

const Ribbon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem;
`

class TopMenu extends React.Component {
  render(){
    return (<Ribbon>
      <TinyLogo />
        <Button onClick={() => this.props.dispatch(push('cultures'))}>Semis/plantation</Button>
        <Button onClick={() => this.props.dispatch(push('grounds'))}>Terrains</Button>
        <Button onClick={() => this.props.dispatch(push('surfaces'))}>Surfaces</Button>
        <Button onClick={() => this.props.dispatch(push('plan'))}>Planifier</Button>
        <Button onClick={() => this.props.dispatch(push('log'))}>Observations</Button>
        <Button onClick={() => this.props.dispatch(push('dataimport'))}>Importer</Button>
    </Ribbon>)
  }
}

export default connect()(TopMenu)
