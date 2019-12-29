import React from 'react'
import { connect } from 'react-redux'
import { Button, FlexBlock } from '../toolbox'
import { EditLogEntry, DataContent } from '../Components'

class Log extends React.Component {
  render() {
    let button, content
    if(this.props.state.get('creating')) {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_LOGENTRY_CREATION' })}>Retour</Button>)
      content = (<EditLogEntry onEditDone={ data => this.props.dispatch({ type: 'CREATE_LOGENTRY', data })} />)
    } else {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_LOGENTRY_CREATION' })}>Ajouter</Button>)
      content = "Logs"
    }
    return (
      <FlexBlock isContainer flexFlow="column">
        <FlexBlock flex="0" alignItems="center">{button}</FlexBlock>
        <FlexBlock flex="1 0">
          <DataContent>{content}</DataContent>
        </FlexBlock>
      </FlexBlock>
    )
  }
}

const mapStateToProps = state => ({
  state: state.global.get('logState')
})

export default connect(mapStateToProps)(Log)
