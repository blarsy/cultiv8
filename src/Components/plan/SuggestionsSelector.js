import React from 'react'
import { connect } from 'react-redux'
import { addIndex, map } from 'ramda'
import moment from 'moment'
import styled from 'styled-components'
import constants from '../../constants'
import { FlexBlock } from '../../toolbox'
import { getDestructionDate } from '../../domain/planner'

const Rating = styled(FlexBlock)`
  color: ${props => props.selected && '#fff'};
  background-color: ${props => props.selected && constants.layout.secundaryDark};
  font-weight: ${props => props.selected && 'bold'};
  padding: ${props => props.selected && '0.25rem'};
  cursor: ${props => !props.selected && 'pointer'};
  &:hover{
    background-color: ${props => !props.selected && constants.layout.primaryLight};
  }
`

const SuggestionButton = styled.button`
  border: 1px solid ${constants.layout.primaryDark};
  background-color: ${props => props.selected ? constants.layout.primaryMedium: '#fff'}
  border-radius: 0.25rem;
  padding: 0.25rem;
  margin: 0.1rem;
  :hover{
    background-color: ${props => !props.selected && constants.layout.primaryLight};
    cursor: ${props => !props.selected && 'pointer'};
  }
  :active,:focus {
    box-shadow: 1px 0 3px 2px ${constants.layout.primaryDark};
    outline: 0;
  }
`

class SuggestionsSelector extends React.Component {
  render() {
    const currentPlan = this.props.planState.get('currentPlan')
    const ratings = currentPlan.get('ratings').toJS()
    return (
      <FlexBlock isContainer flexFlow="column" padding="0.25rem">
        { addIndex(map)((rating, idx) => {
            const ratingIsSelected = idx==currentPlan.get('currentRating')
            let suggestionDetails, suggestionButtons
            if(rating.culture){
              const product = rating.culture.product
              suggestionDetails = (
                <div>
                  <div>{moment(rating.culture.plantDate).format('L')} - {getDestructionDate(rating.culture).format('L')}</div>
                </div>
              )
              if (ratingIsSelected) {
                suggestionButtons = (<div>
                  Suggestions: {
                    addIndex(map)((suggestion, idx) => (
                      <SuggestionButton
                        key={idx}
                        onClick={() => suggestion.id !== rating.selectedSuggestionId && this.props.dispatch({ type: 'CHOOSE_RATING_SUGGESTION', suggestionId: idx })}
                        selected={suggestion.id === rating.selectedSuggestionId}>{idx + 1} - {Math.round(suggestion.score / suggestion.maxScore * 100, 0)}%
                      </SuggestionButton>
                  ), rating.suggestions)}
                </div>)
              }
            } else {
              suggestionDetails = (<span key={rating.name}>Aucune suggestion trouvée</span>)
            }
            return (<Rating
                      isContainer
                      flexFlow="column"
                      selected={ratingIsSelected}
                      key={rating.name}
                      padding="0.25rem"
                      onClick={() => !ratingIsSelected && this.props.dispatch({type: 'SELECT_RATING', rating: idx})}>
              <div>{rating.name}</div>
              {suggestionDetails}
              {suggestionButtons}
            </Rating>)
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
