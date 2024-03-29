import { commitMutation } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'

import environment from '../../Environment'
import { passwordValidation } from '../../utils/credentialsValidation'

const mutation = graphql`
  mutation CreateNewUserMutation($input: CreateEncryptedUserInput!) {
    createEncryptedUser(input: $input) {
      jwtToken
    }
  }
`

export default ({ name, email, password, inviteId, callback }) => {
  console.log(
    name,
    email,
    password,
    inviteId,
    callback,
    ' PODACI IZ CREATE NEW USER'
  )
  const variables = {
    input: {
      _email: email,
      _password: password,
      _name: name,
      _inviteId: inviteId || null,
    },
  }
  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: (response, errors) => {
      if (response.createEncryptedUser) {
        const token = response.createEncryptedUser.jwtToken
        callback(token, null)
      } else {
        callback(null, errors[0].message)
      }
    },
    onError: err => console.error(err),
  })
}
