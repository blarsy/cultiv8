import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { forEach } from 'ramda'
import { List } from 'immutable'
import Select from 'react-select'

class SelectPlot extends React.Component {
  constructor(props){
    super(props)
    this.plotOptions = []
    forEach(plot => this.plotOptions.push({ value: plot.get('code'), label: plot.get('name') }), this.props.plots || [])
  }

  render() {
    return (<Select options={this.plotOptions} value={this.props.value} onChange={e =>
      this.props.onChange(e.value)}>
    </Select>)
  }
}

SelectPlot.propTypes = {
  plots: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string
}

const mapStateToProps = state => {
  if(state.global.get('data')){
    return {
      plots: state.global.get('data').get('plots')
    }
  }
  return { plots: List([]) }
}

export default connect(mapStateToProps)(SelectPlot)
