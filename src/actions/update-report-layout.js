import {PUT} from '@tetris/http'
import assign from 'lodash/assign'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import map from 'lodash/map'
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
    ['reports', report]
  ]))

  layout = map(layout, ({i: id, x, y, h: rows, w: cols}) => ({id, x, y, rows, cols}))

  forEach(layout, module => {
    tree.merge(modulesPath.concat([['modules', module.id]]), module)
  })

  tree.commit()

  return updateReportLayout({company, workspace, folder}, report, layout, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .catch(pushResponseErrorToState(tree))
}

export default updateReportLayoutAction
