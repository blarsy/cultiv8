import React from 'react'
import styled from 'styled-components'
import linkedInLogo from './In-2C-101px-R.png'
import PropTypes from 'prop-types'
import { Button } from '../'

const InlineButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  img {
    height: 1.2em;
    margin-right: 0.5rem;
  }
`

class LinkedInButton extends React.Component {
  render() {
    return (
      <Button onClick={e => this.props.onClick(e)}>
        <InlineButton>
          <img src={linkedInLogo} alt="Linked In logo" />
          {this.props.children}
        </InlineButton>
      </Button>
    )
  }
}

LinkedInButton.propTypes = {
  onClick: PropTypes.func
}

export default LinkedInButton
