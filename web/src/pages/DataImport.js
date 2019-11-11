import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spinner } from '../toolbox'

class DataImport extends React.Component {
  render() {
    return (
      <section>
      {this.props.uploading ? (
        <div>
          <Spinner /> <span>Busy uploading data</span>
        </div>
      ) : (
        <input type="file" onChange={e => this.props.dispatch({type: 'IMPORTFILE_SELECTED', file: e.target.files[0]})} />
      )}
      </section>
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
