import find from 'lodash/find'
import {getStatusIcon} from './get-status-icon'
import assign from 'lodash/assign'
import omit from 'lodash/omit'

export function statusResolver (statuses) {
  function resolver (campaign) {
    const {platform, sub_status, status} = campaign

    const defaultStatus = {
      name: sub_status || status,
      is_active: false,
      platform,
      description: '???'
    }

    const foundDescriptor = find(statuses, {name: sub_status, platform}) ||
      find(statuses, {name: status, platform}) ||
      defaultStatus

    return assign(omit(campaign, 'status', 'sub_status'), {
      status: assign({}, foundDescriptor, {
        status,
        sub_status,
        icon: getStatusIcon(foundDescriptor)
      })
    })
  }

  return resolver
}
