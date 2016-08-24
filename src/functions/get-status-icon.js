import upperCase from 'lodash/toUpper'

export function getStatusIcon ({is_active, name}) {
  if (is_active) return 'play_circle_filled'
  switch (upperCase(name)) {
    case 'ACTIVE':
    case 'ENABLED':
      return 'play_circle_filled'
    case 'PAUSED':
      return 'pause_circle_filled'
    case 'ENDED':
    case 'ARCHIVED':
      return 'remove_circle'
    case 'DELETED':
    case 'REMOVED':
      return 'cancel'
    default:
      return 'help'
  }
}
