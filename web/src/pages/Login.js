import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { LinkedInButton, Block, Spinner } from '../toolbox'
import { setupSignin } from '../ext/google'

const HeroBlock = styled(Block)`
  margin: 0;
  padding: 2rem 0;
  color: #ddd;
  background-color: #333;
`

class Login extends React.Component {
  componentDidMount() {
    setupSignin('signInGoogle', res => {
      this.props.dispatch({
        type: 'LOGIN_GOOGLE_REQUEST',
        profile: res.profile,
        token: res.token
      })
    })
  }

  render() {
    return (
      <section>
        <HeroBlock align="center">
          <h1>Certify your CV in a snap</h1>
        </HeroBlock>
        <Block align="center">
          <LinkedInButton
            onClick={() =>
              this.props.dispatch({ type: 'LOGIN_LINKEDIN_REQUEST' })}
          >
            Login with LinkedIn
          </LinkedInButton>
          {this.props.loggingInLinkedIn && <Spinner />}
        </Block>
        <Block align="center">
          <div id="signInGoogle" className="g-signin2" />
        </Block>
      </section>
    )
  }
}

Login.propTypes = {
  loggingIn: PropTypes.bool
}

const mapStateToProps = state => ({
  loggingInLinkedIn: state.global.get('loggingInLinkedIn')
})

export default connect(mapStateToProps)(Login)
