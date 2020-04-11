import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { find, map, filter, any } from 'ramda'
import { FlexBlock, Button, ValidatedForm, getInitialState } from '../../toolbox'
import { BlockTitle } from '../../StyleLibrary'

class SpecialOps extends React.Component {
  constructor(props){
    super(props)
    this.products = props.products.toJS()

    this.allCultureSurfaceOptions = map(surface => ({ label: surface.plot + ' ' + surface.code, value: surface.id }),
      filter(surface => any(cultureSurface => surface.id === cultureSurface,this.props.culture.surfaces), this.props.surfaces.toJS()))

    this.inputs = [
      {
        type: 'select',
        name: 'surfaces',
        label: 'Surfaces concernées',
        required: true,
        options: this.allCultureSurfaceOptions,
        multi: true
      },
      {
        type: 'date',
        name: 'switchDate',
        label: 'Date de changement',
        required: true
      },
      {
        type: 'textArea',
        name: 'remark',
        label: 'Remarque'
      }
    ]
    this.state = {}
  }

  switchToStatus(status) {

    this.setState({ switchToStatus: status,
      ...getInitialState(this.inputs),
      surfaces: this.allCultureSurfaceOptions,
      switchDate: new Date() })
  }


  render() {
    const product = find(product => product.name === this.props.culture.productName, this.products)
    let content
    if(this.state.switchToStatus) {
      let actionLabel, title
      switch(this.state.switchToStatus){
        case 1:
          actionLabel = "Semer"
          title = "Semis"
          break
        case 2:
          actionLabel = "Implanter"
          title = "Implantation"
          break
        case 3:
          actionLabel = "Récolter"
          title = "Récolte"
          break
        case 100:
          actionLabel = "Destruction"
          title = "Détruire"
          break
        default:
      }
      content = (<ValidatedForm
        margin="10%"
        getState={() => this.state}
        setState={state => this.setState(state)}
        inputs={this.inputs}
        onSubmit={() => {
          this.props.dispatch({
            type: 'SWITCHSTATUS_CULTURE',
            culture: this.props.culture.id,
            targetStatus: this.state.switchToStatus,
            surfaces: this.state.surfaces.length === this.props.culture.surfaces.length ? null : this.state.surfaces,
            date: this.state.switchDate,
            remark: this.state.remark
          })
          this.setState({ switchToStatus: null })}
        }
        actionLabel={actionLabel}
        title={title}
        error={this.state.error} />)
    } else {
      switch (this.props.culture.status) {
        case 3:
          content = (<Button onClick={() => this.switchToStatus(100)}>Libérer des surfaces</Button>)
          break
        case 2:
          content = (<Button onClick={() => this.switchToStatus(3)}>Récolte</Button>)
          break
        case 1:
          if(product.nurseryDays === 0) {
            content = (<Button onClick={() => this.switchToStatus(3)}>Récolte</Button>)
          } else {
            content = (<Button onClick={() => this.switchToStatus(2)}>Implantation</Button>)
          }
          break
        case 0:
          if(product.nurseryDays === 0){
            content = (<Button onClick={() => this.switchToStatus(2)}>Semis/implantation</Button>)
          } else {
            content = (<Button onClick={() => this.switchToStatus(1)}>Semis</Button>)
          }
          break
        default:
      }
    }

    return (<FlexBlock isContainer flexFlow="column" alignItems="center" padding="1rem">
    <BlockTitle>Prochaine étape</BlockTitle>
      {content}
    </FlexBlock>)
  }
}

SpecialOps.propTypes = {
  culture: PropTypes.shape({
    plantDate: PropTypes.string,
    productName: PropTypes.string,
    surfaces: PropTypes.arrayOf(PropTypes.number),
    status: PropTypes.number
  })
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products') || fromJS([]),
  surfaces: state.global.get('data').get('surfaces') || fromJS([])
})

export default connect(mapStateToProps)(SpecialOps)
