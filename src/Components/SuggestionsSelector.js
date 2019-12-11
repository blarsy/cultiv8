import React from 'react'
import { connect } from 'react-redux'
import { addIndex, map } from 'ramda'
import moment from 'moment'
import { FlexBlock } from '../toolbox'

class SuggestionsSelector extends React.Component {
  render() {
    const currentPlan = this.props.planState.get('currentPlan')
    const ratings = currentPlan.get('ratings').toJS()
    return (
      <FlexBlock isContainer flexFlow="column">
        { map(rating => {
            let suggestionDetails
            if(rating.culture){
              const product = rating.culture.product
              suggestionDetails = (
                <div>
                  <div>{moment(rating.culture.plantDate).format('L')} - {moment(rating.culture.plantDate).add(product.growingDays - product.nurseryDays + product.harvestDays, 'days').format('L')}</div>
                  <div>
                    Suggestions: {addIndex(map)((suggestion, idx) => (<span key={idx}>{
                      suggestion.id === rating.selectedSuggestionId ? <b>{idx}</b> : <span>{idx}</span>
                    }</span>), rating.suggestions)}
                  </div>
                </div>
              )
            } else {
              suggestionDetails = (<span key={rating.name}>Aucune suggestion trouvée</span>)
            }
            return (<FlexBlock key={rating.name}>
              <div>{rating.name}</div>
              {suggestionDetails}
            </FlexBlock>)
        }, ratings)}
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => {
  return {
    planState: state.global.get('planState')
  }
}

export default connect(mapStateToProps)(SuggestionsSelector)
