import moment from 'moment'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import toLower from 'lodash/toLower'
import isString from 'lodash/isString'
import isObject from 'lodash/isPlainObject'

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const daysOfWeek = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}

function monthNameToIndex (name) {
  return indexOf(months, toLower(name))
}

function zeroedMoment (str) {
  return str
    ? moment(str).hour(0).minute(0).second(0).millisecond(0)
    : moment().month(0).date(1).hour(0).minute(0).second(0).millisecond(0)
}

const prefixless = name => name.substr(name.indexOf(':') + 1)
const containsNonNumeric = rawValue => isString(rawValue) && rawValue.match(/[^0-9\s,.%]/)

/**
 * @param {Object} attributes attributes for type mapping
 * @param {Array} result result array
 * @return {Array} normalized result
 */
export function normalizeResult (attributes, result) {
  function eachAttribute (value, field) {
    const attribute = find(attributes, ['id', field])

    if (!attribute) return value

    if (
      attribute.type === 'special' &&
      isObject(value) &&
      !containsNonNumeric(value.raw)
    ) {
      return value.value
    }

    let date

    const attributeId = prefixless(attribute.id)

    switch (attributeId) {
      case 'year':
        date = zeroedMoment().year(value).toDate()
        date._format_ = 'YYYY'
        break
      case 'hourofday':
        date = zeroedMoment().hour(value).toDate()
        date._format_ = 'HH:mm'
        break
      case 'month':
        date = zeroedMoment(value).toDate()
        date._format_ = 'MMMM/YY'
        break
      case 'monthofyear':
        date = zeroedMoment().month(monthNameToIndex(value)).toDate()
        date._format_ = 'MMMM'
        break
      case 'date':
        date = zeroedMoment(value).toDate()
        date._format_ = 'DD/MM/YYYY'
        date._simple_ = true
        break
      case 'dayofweek':
        date = zeroedMoment().weekday(daysOfWeek[toLower(value)] || 0).toDate()
        date._format_ = 'dddd'
        break
      case 'week':
        date = zeroedMoment(value).toDate()
        date._format_ = 'W, D/MMM'
        break
      case 'quarter':
        date = zeroedMoment(value).toDate()
        date._format_ = 'MMMM/YY'
        break
      case 'hourly_stats_aggregated_by_advertiser_time_zone':
      case 'hourly_stats_aggregated_by_audience_time_zone':
        const parts = value.substr(0, '00:00:00'.length)
          .split(':')
          .slice(0, 3)
          .map(Number)

        date = zeroedMoment()
          .hour(parts[0])
          .minute(parts[1])
          .second(parts[2])
          .toDate()

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
