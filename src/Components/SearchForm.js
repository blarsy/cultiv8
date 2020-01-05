import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FlexBlock, Button } from '../toolbox'

class SearchForm extends React.Component {
  componentDidMount() {
    if(this.props.globalState.get(this.props.formState) && this.props.globalState.get(this.props.formState).get('lastSearchData'))
      this.props.setState(this.props.globalState.get(this.props.formState).get('lastSearchData').toJS())
  }
  render() {
    return (<FlexBlock isContainer flexFlow="row wrap">
        { this.props.children }
        <FlexBlock flex="0 0 100%" isContainer justifyContent="center" padding="0.5rem">
          <Button onClick={() => this.props.dispatch({ type: this.props.actionName, data: this.props.searchData})} icon="magnifying-glass">Chercher</Button>
        </FlexBlock>
      </FlexBlock>)
  }
}

SearchForm.propTypes = {
  formState: PropTypes.string,
  actionName: PropTypes.string,
  searchData: PropTypes.object,
  setState: PropTypes.func
}

const mapStateToProps = state => ({
  globalState: state.global,
})

export default connect(mapStateToProps)(SearchForm)
