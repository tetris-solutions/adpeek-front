import {GET} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {saveResponseData} from '../functions/save-response-data'

function loadLanguageCriteria (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/criteria/language`, config)
}

export function loadLanguageCriteriaAction (tree, {company, workspace, folder}) {
  return loadLanguageCriteria(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'languageCriteria'
    ]))
    .catch(pushResponseErrorToState(tree))
}
