import React from 'react'
import styled from 'styled-components'
import constants from '../constants'

const Button = styled.button`
  border-radius: 0.25rem;
  background-color: ${constants.layout.primaryLight};
  border: 1px solid ${constants.layout.primaryDark};
  color: #333;
  font-size: 1.25rem;
  padding: ${props => props.children[1] ? '0.5rem' : '0.25rem'};
  transition: background-color 0.5s ease, color 0.25s ease;
  cursor: pointer;
  :hover {
    background-color: ${constants.layout.secundaryLight};
    color: ${constants.layout.primaryLight};
  }
  :active,:focus {
    box-shadow: 1px 0 3px 2px ${constants.layout.primaryDark};
    outline: 0;
  }
  :disabled {
    cursor: default;
    background-color: ${constants.layout.primaryLight};
    color: #888;
  }
`
const Icon = styled.img`
  height: 1rem;
  margin-right: ${props => props.isSoleContent ? '0' : '0.5rem'};
`

export default props => {
  if(!props.icon) {
    return (<Button { ...props}></Button>)
  } else {
    return (<Button {...props}>
      <Icon src={'img/' + props.icon + '.svg'} isSoleContent={!props.children || !props.children[1]}/>
      {props.children}
    </Button>)
  }
}
