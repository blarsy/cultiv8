import React from 'react'
import { connect } from 'react-redux'
import { map, sort } from 'ramda'
import { Checkbox, FlexBlock } from '../../toolbox'
import styled, { css } from 'styled-components'

const compareNumbers = (a, b) => {
  if(a > b) return -1
  if(a < b) return 1
  return 0
}

const CultureLine = styled(FlexBlock)`
  ${props => !props.odd && css`
    background-color: #B5FFCB;
  `}
`
const CultureTitleLine = styled(CultureLine)`
  color: #fff;
  background-color: #B34A49;
`

const CultureCell = styled(FlexBlock)`
  padding: 0.25rem;
`
const CheckboxCell = styled.span`
  padding: 0.25rem;
`

const SurfaceInput = styled.input`
  max-width: 4rem;
`

class CulturesSelector extends React.Component {
  toggleAllSelected(){
    this.props.dispatch({ type: 'PLANMAKE_TOGGLEALLPRODUCTS' })
  }

  toggleSelected(name, targetState){
    this.props.dispatch({ type: 'PLANMAKE_TOGGLEPRODUCT', name })
  }

  setSurface(name, surface) {
    this.props.dispatch({ type: 'PLANMAKE_SETPRODUCTSURFACE', name, surface })
  }

  render() {
    if(this.props.products && this.props.products.size > 0) {
      const sorted = sort((a,b) =>
        compareNumbers(a.get('incomePerSqMeterPerMonthOnTheField'), b.get('incomePerSqMeterPerMonthOnTheField')),
        this.props.products.toArray())
      let odd = false
      const planState = this.props.planState.toJS()
      return (
        <div>
          <CultureTitleLine isContainer alignItems="center">
            <CheckboxCell flex="0 1">
              <label>
                <Checkbox checked={planState.allSelected} onChange={() => {
                  this.toggleAllSelected()
                }}/>
              </label>
            </CheckboxCell>
            <CultureCell flex="1 0">Nom</CultureCell>
            <CultureCell flex="1 0">Surface</CultureCell>
            <CultureCell flex="1 0">Revenu horaire</CultureCell>
            <CultureCell flex="1 0">Rentabilité surface/temps</CultureCell>
          </CultureTitleLine>
          {
            map(culture => {
              odd=!odd
              const name = culture.get('name')
              return (<CultureLine isContainer alignItems="center" odd={odd} key={name}>
                <CheckboxCell flex="0 1">
                  <label>
                    <Checkbox
                      checked={planState.selections[name].selected}
                      onChange={() => this.toggleSelected(name)}/>
                  </label>
                </CheckboxCell>
                <CultureCell flex="1 0">{name}</CultureCell>
                <CultureCell flex="1 0">{planState.selections[name].selected ?
                  <SurfaceInput type="number"
                    value={planState.selections[name].surface.toFixed()}
                    onChange={e => this.setSurface(name, e.target.value)}/> :
                    culture.get('surface').toFixed()}
                  </CultureCell>
                <CultureCell flex="1 0">{culture.get('incomePerWorkHour').toFixed(1)}</CultureCell>
                <CultureCell flex="1 0">{culture.get('interestRatio').toFixed(1)}</CultureCell>
              </CultureLine>)
            }, sorted)
          }
        </div>)
    }
    return <p>No data</p>
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState'),
    products: state.global.get('data').get('products')
  }
}

export default connect(mapStateToProps)(CulturesSelector)
