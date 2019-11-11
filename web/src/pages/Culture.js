import React from 'react'
import { connect } from 'react-redux'
import { CultureList } from '../Components'
import { Button } from '../toolbox'

class Culture extends React.Component {
  render() {
    return (
      <section>
        <Button onClick={() => this.dispatch({ type: 'BEGIN_EDIT_CULTURE' })}>Ajouter</Button>
        <CultureList />
      </section>
    )
  }
}

export default connect()(Culture)
