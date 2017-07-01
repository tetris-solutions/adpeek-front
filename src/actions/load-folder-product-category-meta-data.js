import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from 'tetris-iso/utils'

function loadFolderProductCategoryMetaData (folder, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/product-category-meta-data`, config)
}

export function loadFolderProductCategoryMetaDataAction (tree, {company, workspace, folder}) {
  return loadFolderProductCategoryMetaData(folder, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'productCategoryMetaData'
    ]))
    .catch(pushResponseErrorToState)
}
