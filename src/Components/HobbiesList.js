import React from 'react'
import PropTypes from 'prop-types'
import { map, append } from 'ramda'
import Modal from 'react-modal'
import { Button } from '../toolbox'
import HobbyForm from './HobbyForm'
import HobbyPropType from './CommonPropTypes'

class HobbiesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
      hobbies: props.data
    }
  }
  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isModalOpen: true })}>
          Add
        </Button>
        {map(hobby => <p key={hobby.name}>{hobby.name}</p>, this.state.hobbies)}
        <Modal
          isOpen={this.state.isModalOpen}
          contentLabel="Add hobby"
          onRequestClose={() => this.setState({ isModalOpen: false })}
          shouldCloseOnOverlayClick={true}
        >
          <HobbyForm
            initialData={{}}
            onEditDone={hobby =>
              this.setState({
                hobbies: append(hobby, this.state.hobbies),
                isModalOpen: false
              })}
          />
        </Modal>
      </div>
    )
  }
}

HobbiesList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(HobbyPropType))
}

export default HobbiesList
