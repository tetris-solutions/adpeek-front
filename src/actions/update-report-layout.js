import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import map from 'lodash/map'
import filter from 'lodash/filter'
import findIndex from 'lodash/findIndex'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import qs from 'query-string'

function updateReportLayout (params, report, layout, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/report/${report}/layout?${qs.stringify(params)}`,
    assign({body: layout}, config))
}

export function updateReportLayoutAction (tree, {company, workspace, folder, report}, layout) {
  const modulesPath = getDeepCursor(tree, compact([
    'user',
    ['companies', company],
    workspace && ['workspaces', workspace],
    folder && ['folders', folder],
    ['reports', report],
    'modules'
  ]))

  const modules = tree.get(modulesPath)

  const indexOf = ({id}) => findIndex(modules, {id})
  const exists = m => indexOf(m) >= 0
  const parse = ({i: id, x, y, h: rows, w: cols}) => ({id, x, y, rows, cols})

  layout = filter(map(layout, parse), exists)

  forEach(layout, moduleLayout => {
    tree.merge(modulesPath.concat([indexOf(moduleLayout)]), moduleLayout)
  })

  tree.commit()

  return updateReportLayout({company, workspace, folder}, report, layout, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}
