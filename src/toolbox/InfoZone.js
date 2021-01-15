import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import constants from '../constants'

const Zone = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0.25rem 0.25rem 0 0.25rem;
  background-color: ${constants.layout.secundaryLight}
`

class InfoZone extends Component {
  render() {
    if(this.props.message){
      return (<Zone>
        {this.props.spin && <Spinner size={0.5}/>}
        <span>{this.props.message}</span>
      </Zone>)
    }
    return null
  }
}

const mapStateToProps = state => {
  const uiState = state.global.get('uiState')
  if(uiState) {
    return uiState.toJS()
  }
  return {}
}

export default connect(mapStateToProps)(InfoZone)
