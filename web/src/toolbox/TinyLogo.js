import React from 'react'
import styled from 'styled-components'
import logo from './logo.png'

const Logo = styled.img`
  height: 3rem;
`

export default () => <Logo src={logo} alt="tiny logo" />
