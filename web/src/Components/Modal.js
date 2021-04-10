import React from 'react'
import styled from 'styled-components'
import { AppContextConsumer } from '../AppContext'
import { FlexBlock, Button, Spinner } from '../toolbox'

const Overlay = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
`

const Modal = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`

export default () => (<Overlay>
  <AppContextConsumer>
    {(context) => (<Modal>
        <FlexBlock isContainer justifyContent="center" padding="0.5rem">{context.modal.message}</FlexBlock>
        {context.modal.onOk && (<FlexBlock isContainer justifyContent="center">
          <FlexBlock padding="0.5rem">
            <Button onClick={() => {
              context.modal.onOk()
              context.setContext({ modal: null })
            }}>Ok</Button>
          </FlexBlock>
          <FlexBlock padding="0.5rem">
            <Button onClick={() => {
              context.setContext({ modal: null })
            }}>Annuler</Button>
          </FlexBlock>
        </FlexBlock>)}
        {context.modal.waiter && <Spinner />}
      </Modal>)}
  </AppContextConsumer>
</ Overlay>)
