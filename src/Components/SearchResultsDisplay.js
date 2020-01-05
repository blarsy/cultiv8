import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map, addIndex } from 'ramda'
import styled from 'styled-components'
import { FlexBlock, Button } from './../toolbox'

const Cell = styled(FlexBlock)`
  padding: 0 0.25rem;
`

const ResultsBlock = styled(FlexBlock)`
 padding: 0.25rem;
 border: 1px solid #FF9C9C;
 border-radius: 0.25rem;
`

class SearchResultsDisplay extends React.Component {
  render() {
    if(this.props.searchResults.data.length === 0) {
      return (<FlexBlock isContainer justifyContent="center">
          <span>Pas de résultat à afficher</span>
        </FlexBlock>)
    }
    return (<ResultsBlock isContainer flexFlow="column">
      { map(dataItem => (<FlexBlock key={dataItem.id} isContainer flexFlow="row nowrap">
          <Cell flex="1" isContainer justifyContent="space-around" alignItems="center">
            <Button icon="trash" onClick={() => this.props.dispatch({ type: this.props.searchResults.removeActionName, data: dataItem })} />
            <Button icon="pencil" onClick={() => this.props.dispatch({ type: this.props.searchResults.editActionName, data: dataItem })} />
          </Cell>
          { addIndex(map)((dataColumn, idx) => {
            return (<Cell key={idx} flex={dataColumn.ratio}>{dataColumn.content(dataItem)}</Cell>)
          }, this.props.searchResults.dataColumns) }
        </FlexBlock>), this.props.searchResults.data) }
    </ResultsBlock>)
  }
}

SearchResultsDisplay.propTypes = {
  searchResults: PropTypes.shape({
    dataColumns: PropTypes.arrayOf(PropTypes.shape({
      ratio: PropTypes.number,
      content: PropTypes.func
    })),
    data: PropTypes.arrayOf(PropTypes.object),
    removeActionName: PropTypes.string,
    editActionName: PropTypes.string
  })
}

export default connect()(SearchResultsDisplay)
