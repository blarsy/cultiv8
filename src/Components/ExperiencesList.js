import React from 'react'
import PropTypes from 'prop-types'
import { map, append } from 'ramda'
import Modal from 'react-modal'
import { Button } from '../toolbox'
import ExperienceForm from './ExperienceForm'
import ExperiencePropType from './CommonPropTypes'

class ExperiencesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
      experiences: props.data
    }
  }
  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isModalOpen: true })}>
          Add
        </Button>
        {map(
          experience => <p key={experience.role}>{experience.role}</p>,
          this.state.experiences
        )}
        <Modal
          isOpen={this.state.isModalOpen}
          contentLabel="Add experience"
          onRequestClose={() => this.setState({ isModalOpen: false })}
          shouldCloseOnOverlayClick={true}
        >
          <ExperienceForm
            initialData={{}}
            onEditDone={experience =>
              this.setState({
                experiences: append(experience, this.state.experiences),
                isModalOpen: false
              })}
          />
        </Modal>
      </div>
    )
  }
}

ExperiencesList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(ExperiencePropType))
}

export default ExperiencesList
