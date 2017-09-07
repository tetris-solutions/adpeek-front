import {GET} from '@tetris/http'
import {saveResponseData} from '../functions/save-response-data'
import {getApiFetchConfig, saveResponseTokenAsCookie, pushResponseErrorToState} from '@tetris/front-server/utils'

function loadProductCategories (folder, country, config) {
  return GET(`${process.env.ADPEEK_API_URL}/folder/${folder}/product-categories?country=${country}`, config)
}

export function loadProductCategoriesAction (tree, {company, workspace, folder}, country) {
  return loadProductCategories(folder, country, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(saveResponseData(tree, [
      'user',
      ['companies', company],
      ['workspaces', workspace],
      ['folders', folder],
      'productCategories'
    ]))
    .catch(pushResponseErrorToState)
}
