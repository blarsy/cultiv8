import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map } from 'ramda'
import { TinyLogo, Button, FlexBlock } from '../toolbox'
import MenuRoutes from '../MenuRoutes'
import constants from '../constants'

const MenuButton = styled(Button)`
  background-color: ${props => props.selected ? constants.layout.primaryDark: constants.layout.primaryLight };
  cursor: ${props => props.selected ? 'default': 'pointer' };
  text-align: left;
  :active,:focus {
    box-shadow: ${props => props.selected ? '1px 0 3px 2px ' + constants.layout.primaryMedium: '1px 0 0 2px ' + constants.layout.primaryMedium };
  }
`

class TopMenu extends React.Component {
  render(){
    const pathname = this.props.location.pathname
    return (<FlexBlock isContainer flexFlow="column nowrap" alignItems="center">
      <TinyLogo />
      <FlexBlock isContainer flexFlow="column nowrap">
        { map(menuItem => {
          const selected = menuItem.path === pathname
          return (<MenuButton
            key={menuItem.path}
            to={menuItem.path}
            selected={selected}
            icon={menuItem.icon}>
            {menuItem.caption}
          </MenuButton>)
        }
        , MenuRoutes) }
      </FlexBlock>
    </FlexBlock>)
  }
}

const mapStateToProps = state => {
  return {
    location: state.router.location
  }
}

export default connect(mapStateToProps)(TopMenu)
