import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from '../../toolbox'
import styled from 'styled-components'
import Table from '../Table'

const SurfaceInput = styled.input`
  max-width: 4rem;
`

class ProductsSelector extends React.Component {
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
    const planState = this.props.planState.toJS()
    const dataColumns = [
      {
        titleContent: () => (<label>
          <Checkbox checked={planState.allSelected} onChange={() => {
            this.toggleAllSelected()
          }}/>
        </label>),
        flex: '0 1',
        noSort: true,
        content: product => (<label>
            <Checkbox
              checked={planState.selections[product.name] ? planState.selections[product.name].selected : false}
              onChange={() => this.toggleSelected(product.name)}/>
          </label>)
      },
      {
        title: 'Nom',
        flex: '2 0',
        content: product => product.name,
        flexProps: {
          isContainer: true,
          alignItems: 'center'
        }
      },
      {
        title: 'Surperficie',
        flex: '1 0',
        sort: {
          type: 'number',
          value: product => product.surface
        },
        content: product => ((planState.selections[product.name] && planState.selections[product.name].selected) ?
          <SurfaceInput type="number"
            value={planState.selections[product.name].surface.toFixed()}
            onChange={e => this.setSurface(product.name, e.target.value)}/> :
            product.surface.toFixed()),
        flexProps: {
          isContainer: true,
          alignItems: 'center'
        }
      },
      {
        title: 'Revenu horaire',
        flex: '1 0',
        sort: {
          type: 'number',
          value: product => product.incomePerWorkHour
        },
        content: product => product.incomePerWorkHour.toFixed(1),
        flexProps: {
          isContainer: true,
          alignItems: 'center'
        }
      },
      {
        title: 'Rentabilité surperficie / temps',
        flex: '1 0',
        sort: {
          type: 'number',
          value: product => product.interestRatio
        },
        content: product => product.interestRatio.toFixed(1),
        flexProps: {
          isContainer: true,
          alignItems: 'center'
        }
      }
    ]
    return (<Table data={this.props.products.toJS()} dataColumns={dataColumns} linePadding="0.25rem 0" />)
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState'),
    products: state.global.get('data').get('products')
  }
}

export default connect(mapStateToProps)(ProductsSelector)
