import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { connect } from 'react-redux'
import { List } from 'immutable'

class CultureList extends React.Component {
  render() {
    if(this.props.data && this.props.data.size > 0) {
      return (
        <section>
          {
            map(culture => {
              return (<p key={culture.get('name') + culture.get('greenhouse')}>
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

CultureList.propTypes = {
  data: PropTypes.instanceOf(List)
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      data: state.global.get('data').get('cultures')
    }
  }
  return { data: List([]) }
}

export default connect(mapStateToProps)(CultureList)
