import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import { equals } from 'ramda'
import { Block, ValidatedForm, getInitialState, Button } from '../toolbox'
import {
  ExperiencePropType,
  TrainingPropType,
  HobbyPropType
} from '../Components/CommonPropTypes'
import { ExperiencesList, TrainingsList, HobbiesList } from '../Components'

const inputs = [
  {
    type: 'text',
    name: 'title',
    required: true,
    label: 'Title'
  },
  {
    type: 'textArea',
    name: 'description',
    required: true,
    label: 'Description'
  }
]

class Cv extends React.Component {
  constructor(props) {
    super(props)

    this.state = getInitialState(inputs)
  }

  hasPendingChange() {
    const currentCv = {
      title: this.state.title,
      description: this.state.description,
      experiences: this.state.experiences,
      trainings: this.state.trainings,
      hobbies: this.state.hobbies
    }

    return !equals(this.props.initialCv.equals, currentCv)
  }

  render() {
    return (
      <article>
        <Block align="center">
          <input
            name="file"
            type="file"
            onChange={e =>
              this.props.dispatch({
                type: 'IMPORT_FROM_LINKEDIN',
                file: e.target.files[0]
              })}
          />
        </Block>
        {this.hasPendingChange() &&
          <Block align="center">
            <Button type="submit">Persist in the Blockchain</Button>
          </Block>}
        <Block>
          <ValidatedForm
            title="General info"
            margin="25%"
            inputs={inputs}
            setState={state => this.setState(state)}
            getState={() => this.state}
            onSubmit={() =>
              this.props.dispatch({
                type: 'SAVE_CV_BASIC_DATA',
                data: this.state
              })}
            actionLabel="Save"
          />
          <ExperiencesList data={this.props.initialCv.experiences || []} />
          <HobbiesList data={this.props.initialCv.hobbies || []} />
          <TrainingsList data={this.props.initialCv.trainings || []} />
        </Block>
      </article>
    )
  }
}

Cv.propTypes = {
  profile: PropTypes.object,
  experiences: PropTypes.arrayOf(ExperiencePropType),
  trainings: PropTypes.arrayOf(TrainingPropType),
  hobbies: PropTypes.arrayOf(HobbyPropType)
}

const mapStateToProps = state => ({
  profile: state.global.get('profile'),
  initialCv:
    state.global.get('cv') ||
      fromJS({
        title: '',
        description: '',
        experiences: [],
        trainings: [],
        hobbies: []
      })
})

export default connect(mapStateToProps)(Cv)
