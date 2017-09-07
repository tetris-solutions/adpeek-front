import {getApiFetchConfig, pushResponseErrorToState} from '@tetris/front-server/utils'
import {GET} from '@tetris/http'
import assign from 'lodash/assign'
import get from 'lodash/get'

function loadReportShare (id, config) {
  return GET(`${process.env.ADPEEK_API_URL}/share/report/${id}`, config)
}

function down (level) {
  this.push(0)
  this.push(level)

  return this
}

export function loadReportShareAction (tree, shareId, token = null) {
  function saveReportShare (response) {
    const reportShare = assign({}, response.data)

    reportShare.params = {
      reportShare: shareId,
      report: reportShare.id,
      company: reportShare.company.id,
      workspace: get(reportShare, 'workspace.id'),
      folder: get(reportShare, 'folder.id')
    }

    tree.set('reportShare', reportShare)

    const path = ['user', 'companies']

    path.down = down.bind(path)

    const company = assign({
      savedAccounts: reportShare.accounts
    }, reportShare.company)

    tree.set(path, [company])

    if (reportShare.workspace) {
      tree.set(path.down('workspaces'), [reportShare.workspace])
    }

    if (reportShare.folder) {
      tree.set(path.down('folders'), [reportShare.folder])
    }

    tree.set(path.down('accounts'), reportShare.accounts)
    tree.commit()

    return response
  }

  return loadReportShare(shareId, getApiFetchConfig(tree, token))
    .then(saveReportShare)
    .catch(pushResponseErrorToState(tree))
}

export function loadReportShareActionServerAdaptor ({authToken, params}, res) {
  return loadReportShareAction(res.locals.tree, params.reportShare, authToken)
}
