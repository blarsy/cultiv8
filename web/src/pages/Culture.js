import React from 'react'
import { connect } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import { CultureSearch, CulturesDisplay, EditCulture } from '../Components'
import { Button, FlexBlock } from '../toolbox'

export default () => {
  const { path, url } = useRouteMatch()

  return (
    <FlexBlock isContainer flexFlow="column" flex="1">
      <FlexBlock flex="0">
        <Route exact path={path}>
          <Button icon="plus" to={`/cultures/0`}>Ajouter</Button>
        </Route>
        <Route path={`${path}/:cultureId`}>
          <Button icon="check" to={`/cultures/0`}>Enregistrer</Button>
          <Button to={`${path}`}>Annuler</Button>
        </Route>
      </FlexBlock>
      <FlexBlock isContainer flex="1 0" flexFlow="column" padding="0.5rem" overflow="auto">
        <Route exact path={path}>
          <CultureSearch />
          <CulturesDisplay />
        </Route>
        <Route path={`${path}/:cultureId`}>
          <EditCulture
            onEditDone={data => this.props.dispatch({ type: 'SAVE_CULTURE', data })}
            onOperationDone={() => this.props.dispatch({ type: 'TOGGLE_CULTURE_EDITION' })} />
        </Route>
      </FlexBlock>
    </FlexBlock>
  )
}
