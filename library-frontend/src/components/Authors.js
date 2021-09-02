import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submitEdit = async (event) => {
    event.preventDefault()

    editAuthor({
      variables: {
        name,
        born
      }
    })
  }

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthday</h2>
      <form onSubmit={submitEdit}>
        <div>
          Name
          <input
            value={name}
            onChange={ ({ target }) => setName(target.value) }
          />
        </div>
        <div>
          Born
          <input
            type='number'
            value={born}
            onChange={ ({ target }) => setBorn(parseInt(target.value)) }
          />
        </div>
        <button type='submit'>change</button>
      </form>
    </div>
  )
}

export default Authors
