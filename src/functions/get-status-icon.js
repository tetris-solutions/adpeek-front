import upperCase from 'lodash/upperCase'

/*
<< ADWORDS

  STATUS:
    UNKNOWN
    ENABLED
    PAUSED
    REMOVED

  SUB STATUS:
    SERVING
    NONE
    ENDED
    PENDING
    SUSPENDED

>>

<< FACEBOOK

  STATUS:
    ACTIVE
    PAUSED
    ARCHIVED
    DELETED

  SUB STATUS:
    ACTIVE
    PAUSED
    DELETED
    PENDING_REVIEW
    DISAPPROVED
    PREAPPROVED
    PENDING_BILLING_INFO
    CAMPAIGN_PAUSED
    ARCHIVED
    ADSET_PAUSED

>>
 */

export function getStatusIcon (status, sub_status) {
  switch (upperCase(status)) {
    case 'ACTIVE':
    case 'ENABLED':
      return 'play_circle_filled'
    case 'PAUSED':
      return 'pause_circle_filled'
    case 'ARCHIVED':
      return 'remove_circle'
    case 'DELETED':
    case 'REMOVED':
      return 'cancel'
    default:
      return 'help'
  }
}
