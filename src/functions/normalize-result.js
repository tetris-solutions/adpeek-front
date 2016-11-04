import moment from 'moment'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import toLower from 'lodash/toLower'

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function monthNameToIndex (name) {
  return indexOf(months, toLower(name))
}

function zeroedMoment () {
  return moment().month(0).date(1).hour(0).minute(0).second(0)
}
const prefixless = name => name.substr(name.indexOf(':') + 1)
/**
 * @param {Object} attributes attributes for type mapping
 * @param {Array} result result array
 * @return {Array} normalized result
 */
export function normalizeResult (attributes, result) {
  function eachAttribute (value, field) {
    const attribute = find(attributes, ['id', field])

    if (!attribute) return value

    let date

    const attributeId = prefixless(attribute.id)

    switch (attributeId) {
      case 'year':
        date = zeroedMoment().year(value).toDate()
        date._format_ = 'YYYY'
        break
      case 'hourofday':
        date = new Date()
        date.setHours(value, 0, 0)
        date._format_ = 'HH:mm'
        break
      case 'month':
        date = new Date(value)
        date._format_ = 'MMMM/YY'
        break
      case 'monthofyear':
        date = zeroedMoment().month(monthNameToIndex(value)).toDate()
        date._format_ = 'MMMM'
        break
      case 'date':
        date = moment(value).toDate()
        date._format_ = 'DD/MM/YYYY'
        break
      case 'hourly_stats_aggregated_by_advertiser_time_zone':
      case 'hourly_stats_aggregated_by_audience_time_zone':
        const parts = value.substr(0, '00:00:00'.length)
          .split(':')
          .slice(0, 3)
          .map(Number)

        date = new Date()
        date.setHours(...parts)
        date._format_ = 'HH:mm'

        break
    }

    if (date) {
      date._value_ = value
      return date
    }

    return value
  }

  return map(result, row => mapValues(row, eachAttribute))
}
