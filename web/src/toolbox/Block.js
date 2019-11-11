import styled from 'styled-components'

export default styled.article`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || 'stretch'};
  margin: 1rem 0;
`
