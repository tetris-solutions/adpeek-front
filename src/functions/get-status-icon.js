import upperCase from 'lodash/upperCase'

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
