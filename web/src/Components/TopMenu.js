import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { map } from 'ramda'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { Button, FlexBlock } from '../toolbox'
import MenuRoutes from '../MenuRoutes'
import constants from '../constants'

const ImgInButton = styled.img`
  padding: 0.5rem;
  height: 1rem;
  width: 1rem;
`
const UserButton = styled.button`
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid ${constants.layout.secundaryDark};
  background-color: ${constants.layout.secundaryLight};
  color: ${constants.layout.secundaryDark};
  :active,:focus {
    box-shadow: 1px 0 3px 2px ${constants.layout.secundaryDark};
    outline: 0;
  }
`

const MenuButton = styled(Button)`
  cursor: pointer;
  background-color: ${props => props.selected ? constants.layout.primaryDark: constants.layout.primaryLight };
  cursor: ${props => props.selected ? 'default': 'pointer' };
  text-align: left;
  :active,:focus {
    box-shadow: ${props => props.selected ? '1px 0 3px 2px ' + constants.layout.primaryMedium: '1px 0 0 2px ' + constants.layout.primaryMedium };
  }
`

const DropDown = styled.div`
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`

const DropDownItemsContainer = styled.div`
  position: absolute;
  width: 10rem;
`

const DropDownMenuItem = styled.a`
  cursor: pointer;
  display: block;
  border-radius: 0.25rem;
  :active,:focus {
    box-shadow: 1px 0 3px 2px ${constants.layout.secundaryDark};
    outline: 0;
    text-decoration: none;
  }
  border: 1px solid ${constants.layout.secundaryDark};
  background-color: ${constants.layout.secundaryLight};
  color: ${constants.layout.secundaryDark};
  padding: 0.5rem;
  :hover {
    background-color: ${constants.layout.secundaryDark};
    color: ${constants.layout.secundaryLight};
    text-decoration: none;
  }
`

const TopMenu = (props) => {
  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(1)
  const pathname = props.location.pathname
  return (<FlexBlock isContainer flexFlow="column nowrap" alignItems="center">
    <FlexBlock>
      <UserButton {...buttonProps}>
        <FlexBlock isContainer alignItems="center">
          <ImgInButton src="/img/person.svg" />
          <span>{props.userName}</span>
          <ImgInButton src="/img/caret-bottom.svg" />
        </FlexBlock>
      </UserButton>
      <DropDown isOpen={isOpen} role='menu'>
        <DropDownItemsContainer>
          <DropDownMenuItem {...itemProps[0]} onClick={() => {
              setIsOpen(false)
              props.onLogOut()
            }}>Log out</DropDownMenuItem>
        </DropDownItemsContainer>
      </DropDown>
    </FlexBlock>
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

const mapStateToProps = state => {
  return {
    location: state.router.location
  }
}

export default connect(mapStateToProps)(TopMenu)
