import React from 'react'
import { connect } from 'react-redux'
import { CultureSearch, DataContent, EditCulture } from '../Components'
import { Button, FlexBlock } from '../toolbox'

class Culture extends React.Component {
  render() {
    const creating = this.props.state ? this.props.state.get('creating') : false
    let content, button
    if (creating) {
      button = (<Button onClick={() => this.props.dispatch({ type: 'CANCEL_CREATE_CULTURE' })}>Retour</Button>)
      content = (<EditCulture onEditDone={data => this.props.dispatch({ type: 'SAVE_CULTURE', data })}/>)
    } else {
      button = (<Button onClick={() => this.props.dispatch({ type: 'BEGIN_CREATE_CULTURE' })}>Ajouter</Button>)
      content = (<CultureSearch />)
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
  state: state.global.get('cultureState')
})

export default connect(mapStateToProps)(Culture)
