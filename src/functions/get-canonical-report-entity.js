export function getCanonicalReportEntity (entity) {
  switch (entity) {
    case 'Placement':
      return 'Campaign'
    case 'Search':
    case 'Audience':
    case 'Location':
    case 'Category':
    case 'Query':
      return 'AdGroup'
    default:
      return entity
  }
}
