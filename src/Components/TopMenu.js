import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { push } from 'react-router-redux'
import { map } from 'ramda'
import { TinyLogo, Button, FlexBlock } from '../toolbox'
import MenuRoutes from '../MenuRoutes'

const MenuButton = styled(Button)`
  background-color: ${props => props.selected ? '#5BB375': '#B5FFCB' };
  cursor: ${props => props.selected ? 'default': 'pointer' };
  text-align: left;
  :active,:focus {
    box-shadow: ${props => props.selected ? '1px 0 3px 2px #9CFFB9': '1px 0 0 2px #9CFFB9' };
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
            selected={selected}
            icon={menuItem.icon}
            onClick={() => this.props.dispatch(push(menuItem.path))}>
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
