import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { forEach, find } from 'ramda'
import styled from 'styled-components'
import { Checkbox } from '../../toolbox'
import Table from '../Table'

const SurfaceInput = styled.input`
  max-width: 4rem;
`

class ProductsSelector extends React.Component {
  constructor(props) {
    super(props)
    this.products = this.props.products.toJS()
    this.cultures = this.props.cultures.toJS()
    this.surfacePlannedForProducts = {}
    const oneYearFromNow = moment().add(1, 'years')
    forEach(culture => {
      const product = find(product => product.name === culture.productName, this.products)
      const harvestDate = moment(culture.plantDate).add(-product.nurseryDays + product.growingDays, 'days')
      if(harvestDate.toDate() > moment() && harvestDate.toDate() < oneYearFromNow.toDate()) {
        if(!this.surfacePlannedForProducts[culture.productName])
          this.surfacePlannedForProducts[culture.productName] = (culture.surfaces.length * props.surfaceSize)
        else {
          this.surfacePlannedForProducts[culture.productName] += (culture.surfaces.length * props.surfaceSize)
        }
      }
    }, this.cultures)
  }
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
        content: product => {
          const surfaceAlreadyPlanned = +this.surfacePlannedForProducts[product.name] || 0
          let surfaceDisplay
          if(planState.selections[product.name] && planState.selections[product.name].selected) {
            surfaceDisplay = (<SurfaceInput type="number"
              value={planState.selections[product.name].surface.toFixed()}
              onChange={e => this.setSurface(product.name, e.target.value)}/>)
          } else {
            surfaceDisplay = product.surface.toFixed()
          }
          return (<span>{surfaceDisplay} ({surfaceAlreadyPlanned.toFixed()})</span>)
        },
        flexProps: {
          isContainer: true,
          alignItems: 'center'
        }
      },
      {
        title: 'Serre ?',
        flex: '1 0',
        content: product => product.greenhouse ? 'O': 'N',
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
    return (<Table data={this.products} dataColumns={dataColumns} linePadding="0.25rem 0" />)
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState'),
    products: state.global.get('data').get('products'),
    cultures: state.global.get('data').get('cultures'),
    surfaceSize: state.global.get('data').get('settings').get('surfaceSize'),
    surfaceCount: state.global.get('data').get('surfaces').size
  }
}

export default connect(mapStateToProps)(ProductsSelector)
