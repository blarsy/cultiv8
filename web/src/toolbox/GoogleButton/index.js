import React from 'react'
import styled from 'styled-components'
import googleButton from './btn_google_signin_light_normal_web@2x.png'
import googleButtonFocus from './btn_google_signin_light_focus_web@2x.png'
import googleButtonPressed from './btn_google_signin_light_pressed_web@2x.png'

const Button = styled.button`
  background-size: 100%;
  :active {
    background-image: url(${googleButtonPressed});
  }
  :focus {
    background-image: url(${googleButtonFocus});
  }
`
export default <Button><img src={googleButton} alt="Logo Google" /></Button>
