import styled from 'styled-components'

export default styled.div`
  display: ${props => (props.isContainer ? 'flex' : 'initial')};
  flex-flow: ${props => props.flexFlow};
  flex: ${props => props.flex};
  align-self: ${props => props.alignSelf};
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  padding: ${props => (props.padding ? props.padding : '0')};
  overflow: ${props => props.overflow};
  overflow-x: ${props => props.overflowX};
  overflow-y: ${props => props.overflowY};
`
