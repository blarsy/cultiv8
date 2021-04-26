import React from 'react'
import { ValidatedForm } from '../../toolbox'
import { useParams, useHistory } from 'react-router-dom'
import { useMutation, useQuery, gql } from '@apollo/client'

export default props => {
  const {taskId} = useParams()
  const {loading, error, data} = useQuery(gql`{
    task (_id: "${taskId}") {date}}`)
  const [reschedule, {_, reschedProcessing, reschedError}] = useMutation(gql`
    mutation RecheduleTask($id: ID!, $date: String!) {
      rescheduleTask(_id: $id, date: $date) {_id, date}
    }
  `)
  const history = useHistory()
  if(loading) return 'Loading ...'
  if(error) return error
  return (<ValidatedForm
    initialState={{newDate: data.task.date}}
    processing={reschedProcessing}
    lastError={reschedError}
    margin="10%"
    inputs={[
      {
        type: 'date',
        name: 'newDate',
        label: 'Nouvelle date',
        required: true
      }
    ]}
    onSubmit={async formData => {
      await reschedule({ variables: { id: taskId, date: formData.newDate }})
      return history.push('/home')
    }}
    actionLabel="Ok"
    title="Edition Produit"
  />)
}
