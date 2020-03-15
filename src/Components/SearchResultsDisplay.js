import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from './../toolbox'
import Table from './Table'

class SearchResultsDisplay extends React.Component {
  render() {
    const data = this.props.searchResults.data
    const dataColumns = [
      {
        title: 'Actions',
        ratio: '1',
        flexProps: {
          justifyContent: 'space-around',
          alignItems: 'center'
        },
        noSort: true,
        content: data => [
          (<Button key="trash" icon="trash" onClick={() => this.props.dispatch({ type: this.props.searchResults.removeActionName, data })} />),
          (<Button key="pencil" icon="pencil" onClick={() => this.props.dispatch({ type: this.props.searchResults.editActionName, data })} />)
        ]
      },
      ...this.props.searchResults.dataColumns
    ]

    return (<Table data={data} detailedContent={this.props.detailedContent} dataColumns={dataColumns}/>)
  }
}

SearchResultsDisplay.propTypes = {
  searchResults: PropTypes.shape({
    dataColumns: PropTypes.arrayOf(PropTypes.shape({
      ratio: PropTypes.string,
      content: PropTypes.func,
    })),
    detailedContent: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.object),
    removeActionName: PropTypes.string,
    editActionName: PropTypes.string
  })
}

export default connect()(SearchResultsDisplay)
