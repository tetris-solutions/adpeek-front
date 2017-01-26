import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {DELETE} from '@tetris/http'
import compact from 'lodash/compact'
import {getDeepCursor} from '../functions/get-deep-cursor'

function deleteMailing (company, mailing, config) {
  return DELETE(`${process.env.ADPEEK_API_URL}/company/${company}/mailing/${mailing}`, config)
}

export function deleteMailingAction (tree, params, mailingId) {
  return deleteMailing(params.company, mailingId, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      tree.unset(getDeepCursor(tree, compact([
        'user',
        ['companies', params.company],
        params.workspace && ['workspaces', params.workspace],
        params.folder && ['folders', params.folder],
        params.report && ['reports', params.report],
        ['mailings', mailingId]
      ])))

      tree.set(getDeepCursor(tree, compact([
        'user',
        ['companies', params.company],
        params.workspace && ['workspaces', params.workspace],
        params.folder && ['folders', params.folder],
        params.report && ['reports', params.report],
        'timestamp'
      ])), (new Date()).toISOString())

      tree.commit()

      return response
    })
    .catch(pushResponseErrorToState(tree))
}

export default deleteMailingAction
