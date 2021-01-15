import React from 'react'
import PropTypes from 'prop-types'
import { map, addIndex, sort } from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import { connect } from 'react-redux'
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
 position: relative;
 border: 1px solid ${constants.layout.secundaryLight};
 border-radius: 0.25rem;
`

const Thumb = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  opacity: 0.5;
  :hover {
    opacity: 0.9;
  }
  padding: 0.5rem;
  border: 1px solid #000;
  cursor: pointer;
  display: ${props => props.visible ? 'visible' : 'none'}
`

const Icon = styled.img`
  height: 1rem;
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
    const rawDataLines = []
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
      lines = addIndex(map)((data, lineIdx) => {
        const dataLine = []
        const line = (<Line expandable={this.props.detailedContent} onClick={() => this.setState({ expanded: {[lineIdx]: !this.state.expanded[lineIdx]} })} isContainer key={lineIdx} flexFlow="column">
            <FlexBlock padding={this.props.linePadding} isContainer flexFlow="row nowrap">
              { addIndex(map)((dataColumn, idx) => {
                const content = dataColumn.content(data)
                if(typeof content === "string") dataLine.push(content)
                return (<Cell key={idx} justifyContent={dataColumn.alignRight && 'flex-end'}  alignItems="center" lineIndex={lineIdx} flex={dataColumn.flex} isContainer { ...dataColumn.flexProps }>
                  {content}
                </Cell>)
              }, this.props.dataColumns) }
            </ FlexBlock>
            { this.props.detailedContent && this.state.expanded[lineIdx] && (<Cell key={this.props.dataColumns.length} lineIndex={lineIdx}>{this.props.detailedContent(data)}</Cell>)}
          </Line>)
        rawDataLines.push(dataLine)
        return line
      }, dataToDisplay)
    }
    return (<TableBlock
      overflow="auto"
      isContainer
      flex="1 0"
      flexFlow="column"
      onMouseEnter={e => this.setState({hovered: true})}
      onMouseLeave={e => this.setState({hovered: false})}>
      <Thumb onClick={e => this.props.dispatch({ type: 'COPY_TABLE_BEGIN', data: rawDataLines })} visible={this.state.hovered}><Icon src={'img/copy.svg'}/></Thumb>
      {header}
      <FlexBlock>
        {lines}
      </FlexBlock>
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

export default connect()(Table)
