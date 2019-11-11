import React from 'react'
import PropTypes from 'prop-types'
import { map, append } from 'ramda'
import Modal from 'react-modal'
import { Button } from '../toolbox'
import TrainingForm from './TrainingForm'
import TrainingPropType from './CommonPropTypes'

class TrainingsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
      trainings: props.data
    }
  }
  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isModalOpen: true })}>
          Add
        </Button>
        {map(
          training => <p key={training.certificate}>{training.certificate}</p>,
          this.state.trainings
        )}
        <Modal
          isOpen={this.state.isModalOpen}
          contentLabel="Add training"
          onRequestClose={() => this.setState({ isModalOpen: false })}
          shouldCloseOnOverlayClick={true}
        >
          <TrainingForm
            initialData={{}}
            onEditDone={training =>
              this.setState({
                trainings: append(training, this.state.trainings),
                isModalOpen: false
              })}
          />
        </Modal>
      </div>
    )
  }
}

TrainingsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(TrainingPropType))
}

export default TrainingsList
