import React from 'react'
import { connect } from 'react-redux'
import { map } from 'ramda'
import { List } from 'immutable'
import { Button } from '../toolbox'

class Plan extends React.Component {
  render() {
    if(this.props.data && this.props.data.size > 0) {
      return (
        <section>
          {
            map(culture => {
              return (<p key={culture.get('name') + (culture.get('greenhouse') || 'G')}>
                {culture.get('name')}
              </p>)
            }, this.props.data)
          }
        </section>
      )
    }

    return <p>No data</p>
  }
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      data: state.global.get('data').get('products')
    }
  }
  return { data: List([]) }
}

export default connect(mapStateToProps)(Plan)
