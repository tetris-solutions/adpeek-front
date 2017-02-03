import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'

function loadAdsKPI (folder, ads, metric, config) {
  return POST(`${process.env.ADPEEK_API_URL}/folder/${folder}/ads/${metric}`, assign({}, config, {body: ads}))
}

function findAdPaths (adGroups, adId) {
  const paths = []

  for (let adGroupIndex = 0; adGroupIndex < adGroups.length; adGroupIndex++) {
    const {ads} = adGroups[adGroupIndex]

    if (!ads) continue

    for (let adIndex = 0; adIndex < ads.length; adIndex++) {
      if (String(ads[adIndex].id) === String(adId)) {
        paths.push({adGroupIndex, adIndex})
      }
    }
  }

  return paths
}

export function loadAdsKPIAction (tree, {company, workspace, folder, campaign}, ads) {
  const folderKPI = tree.get(getDeepCursor(tree, compact([
    'user',
    ['companies', company],
    ['workspaces', workspace],
    ['folders', folder],
    'kpi_metric',
    'id'
  ])))

  return loadAdsKPI(folder, ads, folderKPI, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(function onSuccess (response) {
      const result = response.data

      const adGroupsPath = getDeepCursor(tree, compact([
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        campaign && ['campaigns', campaign],
        'adGroups'
      ]))

      const adGroups = tree.get(adGroupsPath)

      forEach(result, (kpi, adId) =>
        forEach(findAdPaths(adGroups, adId), ({adGroupIndex, adIndex}) => {
          const adKPIPath = adGroupsPath.concat([
            adGroupIndex,
            'ads',
            adIndex,
            'kpi'
          ])

          tree.set(adKPIPath, kpi)
        }))
    })
    .catch(pushResponseErrorToState(tree))
}
