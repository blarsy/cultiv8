import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { List } from 'immutable'

const Feed = styled.div`display: flex;
  justify-content: space-between`
const CultureCell = styled.p`flex:2;`
const NormalCell = styled.p`flex:1;`
class Workfeed extends React.Component {
  render() {
    if(this.props.data && this.props.data.size > 0) {
      return (
        <section>
          <Feed>
            <NormalCell>Type</NormalCell>
            <CultureCell>Culture</CultureCell>
            <NormalCell>Quantité (mètres carrés)</NormalCell>
          </Feed>
          {
            map(task => {
              return (<Feed key={task.get('type') + task.get('culture') + task.get('quantity')}>
                <NormalCell>{task.get('type')}</NormalCell>
                <CultureCell>{task.get('culture')}</CultureCell>
                <NormalCell>{task.get('quantity').toFixed(1)}</NormalCell>
              </Feed>)
            }, this.props.data)
          }
        </section>
      )
    }

    return <p>No data</p>
  }
}

Workfeed.propTypes = {
  data: PropTypes.instanceOf(List)
}

const mapStateToProps = state => {
  return {
    data: state.global.get('tasks')
  }
}

export default connect(mapStateToProps)(Workfeed)
