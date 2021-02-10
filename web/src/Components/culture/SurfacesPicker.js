import React from 'react'
import PropTypes from 'prop-types'
import { sort, map, filter, find, append } from 'ramda'
import { connect } from 'react-redux'
import Select from 'react-select'
import styled from 'styled-components'
import { Button, FlexBlock } from '../../toolbox'
import constants from '../../constants'

const TinyButton = styled.button`
  padding: 0 0 0 0.25rem;
  margin: 0;
  border: 0;
`

const AddButton = styled.input`
  border-radius: 0.1rem;
  background-color: ${constants.layout.primaryLight};
  border: 1px solid ${constants.layout.primaryDark};
  color: ${constants.layout.secundaryDark};
  padding: 0.25rem;
  cursor: pointer;
  :active,:focus {
    box-shadow: 1px 0 3px 2px ${constants.layout.primaryDark};
    outline: 0;
  }
`

class SurfacesPicker extends React.Component {
  constructor(props) {
    super(props)

    this.surfaces = this.props.surfaces.toJS()
    this.allOptions = sort((a,b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()), map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.code }), this.surfaces))
    this.state = {
      selected: this.allOptions.length > 0 ? this.allOptions[0].value : null,
      value: [],
      options
    }

    this.addSurface = this.addSurface.bind(this)
  }

  addSurface() {
    this.props.value.push(this.state.selected)
    this.setState({
      options: filter(option => option.value !== this.state.selected, this.state.options),
      selected: null,
      value: this.props.value
    })
  }

  removeSurface (surfaceCodeToRemove) {
    this.props.value = filter(code => code !== surfaceCodeToRemove, this.props.value)
    const optionToMakeSelectable = find(option => option.code === surfaceCodeToRemove, this.allOptions)
    const newListOfOptions =
    this.setState({

    })
  }

  render() {
    return (
      <FlexBlock isContainer flexFlow="row" flex="1" justifyContent="stretch" alignItems="center">
        <FlexBlock>
          <Select value={this.state.selected} options={this.state.options} onChange={e => this.setState({ selected: e.value })}/>
          <AddButton type="button" onClick={this.addSurface} value="Ajouter cette surface" />
        </FlexBlock>
        <FlexBlock isContainer flexFlow="row" flex="1">
          {
            map(value => {
              const surface = find(surface => surface.code === value, this.surfaces)
              return (<div>
                <span>{surface.plot + ' ' + surface.code}</span>
                <TinyButton onClick={e => this.removeSurface(e.target)}>X</TinyButton>
              </div>)
            }
            , this.props.value)
          }
        </FlexBlock>
      </FlexBlock>
    )
  }
}

SurfacesPicker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = state => ({
  surfaces: state.global.get('data').get('surfaces')
})

export default connect(mapStateToProps)(SurfacesPicker)
