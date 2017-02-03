import {POST} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import assign from 'lodash/assign'
import {getDeepCursor} from '../functions/get-deep-cursor'
import compact from 'lodash/compact'
import forEach from 'lodash/forEach'
import isNumber from 'lodash/isNumber'
import {prettyNumber} from '../functions/pretty-number'

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

export function loadAdsKPIAction (tree, {company, workspace, folder, campaign}, ads, {kpi_positive, kpi_name: name, kpi_goal, kpi_metric: {id: metric, type}}) {
  if (isNumber(kpi_goal)) {
    if (type === 'percentage') {
      kpi_goal = kpi_goal / 100
    }
  }

  const locale = tree.get(['user', 'locale']) || tree.get(['locale'])

  return loadAdsKPI(folder, ads, metric, getApiFetchConfig(tree))
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

      forEach(result, (value, adId) => {
        if (!isNumber(value)) return

        function saveAdKPI ({adGroupIndex, adIndex}) {
          const adKPIPath = adGroupsPath.concat([
            adGroupIndex,
            'ads',
            adIndex,
            'kpi'
          ])

          let status = 'neutral'

          if (isNumber(kpi_goal)) {
            if (kpi_positive) {
              status = value > kpi_goal ? 'good' : 'bad'
            } else {
              status = value > kpi_goal ? 'bad' : 'good'
            }
          }

          tree.set(adKPIPath, {
            name,
            text: prettyNumber(value, type, locale),
            status,
            value
          })
        }

        forEach(findAdPaths(adGroups, adId), saveAdKPI)
      })
    })
    .catch(pushResponseErrorToState(tree))
}
