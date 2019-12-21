import React from 'react'
import { connect } from 'react-redux'
import { FlexBlock } from '../toolbox'

class DataContent extends React.Component {
  render() {
    if(this.props.data) {
      return this.props.children
    }
    return (
      <FlexBlock isContainer flexFlow="column" alignItems="center">
        <FlexBlock flexFlow="row" justifyContent="center">
          Aucune donnée disponible. Veuillez importer ou encoder des données.
        </FlexBlock>
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => {
  return {
    data: state.global.get('data')
  }
}

export default connect(mapStateToProps)(DataContent)
