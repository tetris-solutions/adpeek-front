import {PUT} from '@tetris/http'
import {saveResponseTokenAsCookie, getApiFetchConfig, pushResponseErrorToState} from 'tetris-iso/utils'
import {getDeepCursor} from '../functions/get-deep-cursor'
import concat from 'lodash/concat'
import assign from 'lodash/assign'
import filter from 'lodash/filter'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'

function updateCampaignLocation (id, locations, config) {
  return PUT(`${process.env.ADPEEK_API_URL}/campaign/${id}/criteria/location`, assign({body: locations}, config))
}

const normalize = ({id, name: location, type: location_type}) => ({
  id,
  location,
  location_type,
  type: 'LOCATION'
})

export function updateCampaignLocationAction (tree, {company, workspace, folder, campaign}, locations) {
  return updateCampaignLocation(campaign, locations, getApiFetchConfig(tree))
    .then(saveResponseTokenAsCookie)
    .then(response => {
      const criteriaPath = getDeepCursor(tree, [
        'user',
        ['companies', company],
        ['workspaces', workspace],
        ['folders', folder],
        ['campaigns', campaign],
        'details',
        'criteria'
      ])

      const oldCriteria = tree.get(criteriaPath)

      const indexedLocations = keyBy(locations, 'id')
      const indexedCriteria = keyBy(oldCriteria, 'id')

      const untouched = ({id, type}) => (
        type !== 'LOCATION' ||
        Boolean(indexedLocations[id])
      )
      const isNew = ({id}) => !indexedCriteria[id]

      const notRemovedCriteria = filter(oldCriteria, untouched)
      const insertedCriteria = map(filter(locations, isNew), normalize)

      tree.set(criteriaPath, concat(notRemovedCriteria, insertedCriteria))

      return response
    })
    .catch(pushResponseErrorToState(tree))
}
