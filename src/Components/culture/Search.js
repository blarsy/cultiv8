import React from 'react'
import { connect } from 'react-redux'
import { FlexBlock } from '../../toolbox'

class Search extends React.Component {
  render() {
    return (<FlexBlock isContainer justifyContent="stretch">
      BLA
    </FlexBlock>)
  }
}

const mapStateToProps = state => {
  return {
    products: state.global.get('data') && state.global.get('data').get('products')
  }
}

export default connect(mapStateToProps)(Search)
