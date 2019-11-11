import React from 'react'
import styled from 'styled-components'
import spinner from '../spinner.gif'

const Spinner = styled.img`
  height: 1rem;
  width: 1rem;
  `

export default () => <Spinner src={spinner} alt="spinner" />
