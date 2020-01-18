import React from 'react'
import { connect } from 'react-redux'
import { CultureSearch, CulturesDisplay, DataContent, EditCulture } from '../Components'
import { Button, FlexBlock } from '../toolbox'

class Culture extends React.Component {
  render() {
    const editing = this.props.state ? this.props.state.get('editing') : false
    let content, button
    if (editing) {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_CULTURE_EDITION' })}>Retour</Button>)
      content = (<EditCulture onEditDone={data => this.props.dispatch({ type: 'SAVE_CULTURE', data })}/>)
    } else {
      button = (<Button onClick={() => this.props.dispatch({ type: 'TOGGLE_CULTURE_EDITION' })}>Ajouter</Button>)
      content = (<FlexBlock isContainer flexFlow="column" alignItems="stretch">
          <CultureSearch />
          <CulturesDisplay />
        </FlexBlock>
      )
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

  componentWillUnmount() {
    this.props.dispatch({ type: 'DISMISS_SEARCHRESULT', stateName: 'cultureState' })
  }
}

const mapStateToProps = state => ({
  state: state.global.get('cultureState')
})

export default connect(mapStateToProps)(Culture)
