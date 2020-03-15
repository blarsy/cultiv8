import React from 'react'
import PropTypes from 'prop-types'
import { map, addIndex, sort } from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { FlexBlock } from './../toolbox'
import constants from '../constants'

const Cell = styled(FlexBlock)`
  padding: 0 0.25rem;
  background-color: ${props => props.lineIndex % 2 !== 0 && constants.layout.primaryLight};
`
const HeaderCell = styled(FlexBlock)`
  padding: 0.25rem;
  background-color: ${constants.layout.secundaryDark};
  color: ${constants.layout.primaryLight};
  cursor: ${props => props.sortable && 'pointer'};
`

const Line = styled(FlexBlock)`
  padding: ${props => props.padding};
  cursor: ${props => props.expandable && 'pointer'};
`

const TableBlock = styled(FlexBlock)`
 border: 1px solid ${constants.layout.secundaryLight};
 border-radius: 0.25rem;
`

class Table extends React.Component {
  constructor(props) {
    super(props)

    this.state = { expanded: {}}
  }

  sort(colIndex) {
    let asc = true
    if(this.state.sortColumnIndex && this.state.sortColumnIndex === colIndex) asc = !this.state.asc
    this.setState({ sortColumnIndex: colIndex, asc })
  }

  render() {
    let lines
    const header = (<FlexBlock isContainer>
      { addIndex(map)((dataColumn, idx) => (
        <HeaderCell
          onClick={() => dataColumn.noSort ? null : this.sort(idx+1)}
          isContainer
          sortable={!dataColumn.noSort}
          key={idx}
          justifyContent="center"
          flex={dataColumn.flex}>
            {dataColumn.title || dataColumn.titleContent()}
        </HeaderCell>), this.props.dataColumns) }
    </FlexBlock>)
    if(this.props.data.length === 0) {
      lines = (<FlexBlock isContainer justifyContent="center">
        <span>Pas de résultat à afficher</span>
      </FlexBlock>)
    } else {
      const sortColIdx = this.state.sortColumnIndex
      let dataToDisplay = this.props.data
      if(sortColIdx) {
        const actualSortIdx = sortColIdx - 1
        let compare
        const sortType = this.props.dataColumns[actualSortIdx].sort && this.props.dataColumns[actualSortIdx].sort.type
        switch (sortType || typeof this.props.dataColumns[actualSortIdx].content(dataToDisplay[0])) {
          case "number":
            if(this.state.asc)
              compare = (a, b) => a - b
            else
              compare = (a, b) => b - a
            break;
          case "string":
            if(this.state.asc)
              compare = (a, b) => a.toUpperCase().localeCompare(b.toUpperCase())
            else
              compare = (a, b) => b.toUpperCase().localeCompare(a.toUpperCase())
            break
          case "date":
            if(this.state.asc)
              compare = (a, b) => moment(a).toDate() - moment(b).toDate()
            else
              compare = (a, b) => moment(b).toDate() - moment(a).toDate()
            break
          default:
            if(this.state.asc)
              compare = (a, b) => (a || '').toString().toUpperCase().localeCompare((b || '').toString().toUpperCase())
            else
              compare = (a, b) => (b || '').toString().toUpperCase().localeCompare((a || '').toString().toUpperCase())
        }
        dataToDisplay = sort((a, b) => {
          let valA
          let valB
          if(this.props.dataColumns[actualSortIdx].sort) {
            valA = this.props.dataColumns[actualSortIdx].sort.value(a)
            valB = this.props.dataColumns[actualSortIdx].sort.value(b)
          } else {
            valA = this.props.dataColumns[actualSortIdx].content(a)
            valB = this.props.dataColumns[actualSortIdx].content(b)
          }
          return compare(valA, valB)
        }, this.props.data)
      }
      lines = addIndex(map)((data, lineIdx) => (<Line expandable={this.props.detailedContent} onClick={() => this.setState({ expanded: {[lineIdx]: !this.state.expanded[lineIdx]} })} isContainer key={lineIdx} flexFlow="column">
          <FlexBlock padding={this.props.linePadding} isContainer flexFlow="row nowrap">
            { addIndex(map)((dataColumn, idx) => <Cell key={idx} justifyContent={dataColumn.alignRight && 'flex-end'}  alignItems="center" lineIndex={lineIdx} flex={dataColumn.flex} isContainer { ...dataColumn.flexProps }>{dataColumn.content(data)}</Cell>, this.props.dataColumns) }
          </ FlexBlock>
          { this.props.detailedContent && this.state.expanded[lineIdx] && (<Cell key={this.props.dataColumns.length} lineIndex={lineIdx}>{this.props.detailedContent(data)}</Cell>)}
        </Line>), dataToDisplay)
    }
    return (<TableBlock overflow="auto" isContainer flexFlow="column">
      {header}
      {lines}
    </TableBlock>)
  }
}

Table.propTypes = {
  dataColumns: PropTypes.arrayOf(PropTypes.shape({
    ratio: PropTypes.string,
    content: PropTypes.func,
    title: PropTypes.string,
  })),
  detailedContent: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  linePadding: PropTypes.string
}

export default Table
