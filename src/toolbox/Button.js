import styled from 'styled-components'

export default styled.button`
  border-radius: 0.5rem;
  background-color: #666;
  color: #DDD;
  font-size: 1.25rem;
  padding: 0.5rem;
  :hover {
    background-color: #888;
  }
  :active,:focus {
    box-shadow: 1px 0 3px 2px #666;
    outline: 0;
  }
  :disabled {
    cursor: pointer;
    background-color: #999;
    color: #333;
  }
`
