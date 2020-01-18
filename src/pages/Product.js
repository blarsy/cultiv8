import React from 'react'
import { connect } from 'react-redux'
import { Button, FlexBlock } from '../toolbox'
import { ProductSearch, ProductsDisplay, DataContent, EditProduct } from '../Components'

class Product extends React.Component {
  render() {
    let button, content
    if(this.props.state.get('editing')) {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_PRODUCT_CREATION' })} icon="chevron-left">Retour</Button>)
      content = (<EditProduct onEditDone={ data => this.props.dispatch({ type: 'SAVE_PRODUCT', data })  }/>)
    } else {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_PRODUCT_CREATION' })} icon="plus">Ajouter</Button>)
      content = (<FlexBlock isContainer flexFlow="column" alignItems="stretch">
        <ProductSearch />
        <ProductsDisplay />
      </FlexBlock>)
    }
    return (
      <FlexBlock isContainer flexFlow="column">
        <FlexBlock flex="0" alignItems="center" padding="0 0 0.5rem">{button}</FlexBlock>
        <FlexBlock flex="1 0">
          <DataContent>{content}</DataContent>
        </FlexBlock>
      </FlexBlock>
    )
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'DISMISS_SEARCHRESULT', stateName: 'productState' })
  }
}

const mapStateToProps = state => ({
  state: state.global.get('productState')
})

export default connect(mapStateToProps)(Product)
