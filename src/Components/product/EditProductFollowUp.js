import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { sort, map, uniq, union, forEach, find } from 'ramda'
import moment from 'moment'
import Table from '../Table'
import { ValidatedForm, getInitialState, Button, FlexBlock } from '../../toolbox'

class EditProductFollowUp extends React.Component {
  constructor(props) {
    super(props)
    let allActionTypes = []
    forEach(product =>
      allActionTypes = union(allActionTypes,
        map(followUp => ({value: followUp.actionType, label: followUp.actionType }), product.followUp || []))
    , this.props.products.toJS())
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

    this.followUpTableDataColumns = [
      {
        title: 'Actions',
        flex: '1',
        content: followUpTask => ([
          (<Button key="pencil" icon="pencil" onClick={() => this.setState({ editing: true, ...followUpTask })}></Button>),
          (<Button key="trash" icon="trash" onClick={() => this.props.dispatch({ type: 'REMOVE_PRODUCT_FOLLOWUP', productName: this.props.productState.get('editedProduct').get('name'), id: followUpTask.id})}></Button>)
        ])
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
          if(followUpTask.growingDays) {
            return followUpTask.growingDays + ' jours'
          } else {
            return moment(followUpTask.dateBegin).format('L') + ' - ' + moment(followUpTask.dateEnd).format('L')
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
    this.state = getInitialState(this.followUpInputs)

  }

  render() {
    this.product = find(product => product.name === this.props.productState.get('editedProduct').get('name'), this.props.products.toJS())

    let content
    if(this.state.adding || this.state.editing) {
      content = (<ValidatedForm
          margin="10%"
          getState={() => this.state}
          setState={state => this.setState(state)}
          inputs={this.followUpInputs}
          onSubmit={() => {
            this.props.dispatch({ type: 'MODIFY_PRODUCTFOLLOWUP', productName: this.product.name, data: this.state })
            this.setState({adding: false, editing: false})
          }}
          actionLabel="Ok"
          title="Gestion tâche de suivi"
        />)
    } else {
      content =(<FlexBlock>
        <Button onClick={() => {
            this.setState({ adding: true })
        }}>Ajouter</Button>
      <Table data={sort((a, b) => b.growingDays - a.growingDays, this.product.followUp || [])} dataColumns={this.followUpTableDataColumns} />
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
