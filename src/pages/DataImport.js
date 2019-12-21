import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spinner, FlexBlock } from '../toolbox'

class DataImport extends React.Component {
  render() {
    return (
      <FlexBlock isContainer flexFlow="column" justifyContent="center" alignItems="center">
      {this.props.uploading ? (
        <div>
          <Spinner /> <span>Busy uploading data</span>
        </div>
      ) : (
        <FlexBlock isContainer flexFlow="column">
          <label htmlFor="fileToImport">Choisir un fichier de tableur contenant les données:</label>
          <input id="fileToImport" type="file" onChange={e => this.props.dispatch({type: 'IMPORTFILE_SELECTED', file: e.target.files[0]})} />
        </FlexBlock>
      )}
      </FlexBlock>
    )
  }
}

DataImport.propTypes = {
  uploading: PropTypes.bool
}

const mapStateToProps = state => ({
  uploading: state.global.get('uploading')
})

export default connect(mapStateToProps)(DataImport)
