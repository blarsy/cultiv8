import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spinner, FlexBlock, Button } from '../toolbox'

class DataImport extends React.Component {
  render() {
    if(this.props.uploading) {
      return (<div>
        <Spinner /> <span>Busy uploading data</span>
      </div>)
    }
    return (
      <FlexBlock isContainer flexFlow="column" justifyContent="stretch" alignItems="center">
        <FlexBlock isContainer flexFlow="column">
          <label htmlFor="fileToImport">Choisir un fichier contenant les données (tableur, ou JSON):</label>
          <input id="fileToImport" type="file" onChange={e => this.props.dispatch({type: 'IMPORTFILE_SELECTED', file: e.target.files[0]})} />
        </FlexBlock>
        <FlexBlock isContainer flexFlow="column" padding="1rem 0 0">
          <span>Télécharger sur votre ordinateur toutes les données actuellement stockées dans cette application:</span>
          <Button onClick={() => this.props.dispatch({ type: 'DOWNLOAD_ALL_DATA'})}>Exporter</Button>
        </FlexBlock>
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
