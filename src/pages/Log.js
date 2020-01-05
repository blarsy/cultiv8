import React from 'react'
import { connect } from 'react-redux'
import { Button, FlexBlock } from '../toolbox'
import { EditLogEntry, DataContent, LogSearch, LogEntriesDisplay } from '../Components'

class Log extends React.Component {
  constructor(props) {
    super(props)

    this.state = { logs: [] }
  }

  render() {
    let button, content
    if(this.props.state.get('editing')) {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_LOGENTRY_CREATION' })} icon="chevron-left">Retour</Button>)
      content = (<EditLogEntry onEditDone={ data => this.props.dispatch({ type: 'SAVE_LOGENTRY', data })} />)
    } else {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_LOGENTRY_CREATION' })} icon="plus">Ajouter</Button>)
      content = (<FlexBlock isContainer flexFlow="column" alignItems="stretch">
        <LogSearch />
        <LogEntriesDisplay />
      </FlexBlock>)
    }
    return (
      <FlexBlock isContainer flexFlow="column">
        <FlexBlock flex="0" alignItems="center" padding="0 0 0.5rem">{button}</FlexBlock>
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
