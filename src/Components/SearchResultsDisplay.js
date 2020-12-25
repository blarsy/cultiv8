import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'ramda'
import { Button, FlexBlock } from './../toolbox'
import Table from './Table'

class SearchResultsDisplay extends React.Component {
  render() {
    const data = this.props.searchResults.data

    const dataColumns = [
      {
        title: 'Actions',
        ratio: '1',
        flexProps: {
          justifyContent: 'center',
          alignItems: 'center'
        },
        flex: '1 0 5rem',
        noSort: true,
        content: data => [
          (<Button key="trash" icon="trash" onClick={() => this.props.dispatch({ type: this.props.searchResults.removeActionName, data })} />),
          (<Button key="pencil" icon="pencil" onClick={() => this.props.dispatch({ type: this.props.searchResults.editActionName, data })} />),
          ...map(action => (<Button key={action.icon} icon={action.icon} onClick={() => action.action(data)}></Button>), this.props.searchResults.otherActions || [])
        ]
      },
      ...this.props.searchResults.dataColumns
    ]
    return (<FlexBlock isContainer overflow="hidden">
      <Table data={data} detailedContent={this.props.detailedContent} dataColumns={dataColumns}/>
    </FlexBlock>)
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
    editActionName: PropTypes.string,
    otherActions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
      action: PropTypes.func
    }))
  })
}

export default connect()(SearchResultsDisplay)
