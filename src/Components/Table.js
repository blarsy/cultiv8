import React from 'react'
import PropTypes from 'prop-types'
import { map, addIndex, sort } from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { FlexBlock } from './../toolbox'

const Cell = styled(FlexBlock)`
  padding: 0 0.25rem;
`
const HeaderCell = styled(FlexBlock)`
  padding: 0.25rem;
  background-color: #B34A49;
  color: #B5FFCB;
  cursor: ${props => props.sortable && 'pointer'};
`

const Line = styled(FlexBlock)`
  background-color: ${props => props.index % 2 !== 0 && '#B5FFCB'};
  padding: ${props => props.padding}
`

const TableBlock = styled(FlexBlock)`
 border: 1px solid #FF9C9C;
 border-radius: 0.25rem;
`

class Table extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
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
          onClick={() => dataColumn.noSort ? null : this.sort(idx)}
          isContainer
          sortable={!dataColumn.noSort}
          key={idx}
          justifyContent="center"
          flex={dataColumn.ratio}>
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
        let compare
        const sortType = this.props.dataColumns[sortColIdx].sort && this.props.dataColumns[sortColIdx].sort.type
        switch (sortType || typeof this.props.dataColumns[sortColIdx].content(dataToDisplay[0])) {
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
          default:
            if(this.state.asc)
              compare = (a, b) => a.toString().toUpperCase().localeCompare(b.toString().toUpperCase())
            else
              compare = (a, b) => b.toString().toUpperCase().localeCompare(a.toString().toUpperCase())
        }
        dataToDisplay = sort((a, b) => {
          let valA
          let valB
          if(this.props.dataColumns[sortColIdx].sort) {
            valA = this.props.dataColumns[sortColIdx].sort.value(a)
            valB = this.props.dataColumns[sortColIdx].sort.value(b)
          } else {
            valA = this.props.dataColumns[sortColIdx].content(a)
            valB = this.props.dataColumns[sortColIdx].content(b)
          }
          return compare(valA, valB)
        }, this.props.data)
      }
      lines = addIndex(map)((data, lineIdx) => (<Line key={lineIdx} index={lineIdx} padding={this.props.linePadding} isContainer flexFlow="row nowrap">
        { addIndex(map)((dataColumn, idx) => <Cell key={idx} flex={dataColumn.ratio} isContainer={!!dataColumn.flexProps} { ...dataColumn.flexProps }>{dataColumn.content(data)}</Cell>, this.props.dataColumns) }
      </ Line>), dataToDisplay)
    }
    return (<TableBlock isContainer flexFlow="column">
      {header}
      {lines}
    </TableBlock>)
  }
}

Table.propTypes = {
  dataColumns: PropTypes.arrayOf(PropTypes.shape({
    ratio: PropTypes.string,
    content: PropTypes.func,
    title: PropTypes.string
  })),
  data: PropTypes.arrayOf(PropTypes.object),
  linePadding: PropTypes.string
}

export default Table
