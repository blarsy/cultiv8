import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { sort, map, uniq, union, forEach } from 'ramda'
import moment from 'moment'
import Table from '../Table'
import { ValidatedForm, getInitialState, Button, FlexBlock } from '../../toolbox'

class EditProductFollowUp extends React.Component {
  constructor(props) {
    super(props)
    let allActionTypes = []
    forEach(product => allActionTypes = union(allActionTypes, map(followUp => followUp.actionType, product.followUp), this.props.products.toJS()))
    const actionTypeOptions = uniq(allActionTypes)

    this.followUpInputs = [
      {
        type: 'number',
        name: 'growingDays',
        label: 'Stade de croissance (jours)',
        required: false
      },
      {
        type: 'date',
        name: 'dateBegin',
        label: 'A partir de',
        required: false
      },
      {
        type: 'date',
        name: 'dateEnd',
        label: 'Jusqu\'à',
        required: false
      },
      {
        type: 'select',
        name: 'actionType',
        label: 'Type d\'action',
        required: true,
        multi: false,
        creatable: true,
        options: actionTypeOptions
      },
      {
        type: 'text',
        name: 'details',
        label: 'Précisions',
        required: false
      }
    ]

    this.product = props.productState.get('editedProduct').toJS()
    const initialState = getInitialState(this.followUpInputs)
    if(!this.product.followUp){
      this.state = { ...initialState, followUpTasks : [] }
    } else {
      this.state = { ...initialState, followUpTasks : sort((a, b) => b.growingDays - a.growingDays, this.product.followUp) }
    }

    this.followUpTableDataColumns = [
      {
        title: 'Actions',
        flex: '1',
        content: followUpTask => (<Button icon="pencil" onClick={() => this.setState({ editing: true, ...followUpTask })}></Button>)
      },
      {
        title: 'Type de temporalité',
        flex: '1',
        content: followUpTask => followUpTask.growingDays ? 'Stade de croissance' : 'Période de l\'année'
      },
      {
        title: 'Quand ?',
        flex: '1',
        content: followUpTask => {
          switch(followUpTask.schedulingType) {
            case 1:
              return followUpTask.growingDays + ' jours'
            case 2:
              return moment(followUpTask.dateBegin).format('L') + ' - ' + moment(followUpTask.dateEnd).format('L')
            default:
              return '?'
          }
        }
      },
      {
        title: 'Type d\'action',
        flex: '2',
        content: followUpTask => followUpTask.actionType
      },
      {
        title: 'Précisions',
        flex: '3',
        content: followUpTask => followUpTask.details
      }
    ]

  }

  render() {
    let content
    if(this.state.adding || this.state.editing) {
      content = (<ValidatedForm
          margin="10%"
          getState={() => this.state}
          setState={state => this.setState(state)}
          inputs={this.followUpInputs}
          onSubmit={() => {
            this.props.dispatch({ type: 'MODIFY_PRODUCTFOLLOWUP', productId: this.product.id, data: this.state })}
          }
          actionLabel="Ok"
          title="Gestion tâche de suivi"
        />)
    } else {
      content =(<FlexBlock>
        <Button onClick={() => this.setState({ adding: true })}>Ajouter</Button>
        <Table data={this.state.followUpTasks} dataColumns={this.followUpTableDataColumns} />
      </FlexBlock>)
    }
    return content
  }
}

EditProductFollowUp.propTypes = {
  onEditDone: PropTypes.func
}

const mapStateToProps = state => ({
  products: state.global.get('data').get('products'),
  productState: state.global.get('productState')
})

export default connect(mapStateToProps)(EditProductFollowUp)
