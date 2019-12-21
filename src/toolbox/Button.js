import styled from 'styled-components'

export default styled.button`
  border-radius: 0.25rem;
  background-color: #B5FFCB;
  border: 1px solid #5BB375;
  color: #B34A49;
  font-size: 1.25rem;
  padding: 0.5rem;
  cursor: pointer;
  :hover {
    background-color: #FF9C9C;
    color: #B5FFCB;
  }
  :active,:focus {
    box-shadow: 1px 0 3px 2px #5BB375;
    outline: 0;
  }
  :disabled {
    cursor: default;
    background-color: #B5FFCB;
    color: #FF9C9C;
  }
`
