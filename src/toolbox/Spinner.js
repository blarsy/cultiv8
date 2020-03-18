import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import spinner from '../spinner.gif'

const SpinnerImage = styled.img`
  height: ${props => props.size || 1}rem;
  width: ${props => props.size || 1}rem;
  `

class Spinner extends Component {
  render() {
    return (<SpinnerImage src={spinner} size={this.props.size} alt="spinner" />)
  }
}
Spinner.propTypes = {
  size: PropTypes.number
}

export default Spinner
