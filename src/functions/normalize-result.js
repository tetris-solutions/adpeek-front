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

export class WrapDate {
  /**
   *
   * @param {Date} date wrapped date
   * @param {String} format friendly format
   * @param {Boolean} [simple=false] whether it is a simple date
   */
  constructor (date, format, simple = false) {
    this.date = date
    this.dateFormat = format
    this.isSimpleDate = simple
  }

  setValue (value) {
    this._value_ = value
  }

  toString () {
    return this.date.toString()
  }
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
        date = new WrapDate(date = zeroedMoment().year(value).toDate(), 'YYYY')
        break
      case 'hour':
      case 'hourofday':
        date = new WrapDate(zeroedMoment().hour(value).toDate(), 'HH:mm')
        break
      case 'yearmonth':
      case 'month':
        date = new WrapDate(zeroedMoment(value).toDate(), 'MMMM/YY')
        break
      case 'month_of_year':
      case 'monthofyear':
        date = new WrapDate(zeroedMoment().month(monthNameToIndex(value)).toDate(), 'MMMM')
        break
      case 'date':
        date = new WrapDate(zeroedMoment(value).toDate(), 'DD/MM/YYYY', true)
        break
      case 'day_of_week':
      case 'dayofweekname':
      case 'dayofweek':
        date = new WrapDate(zeroedMoment().weekday(daysOfWeek[toLower(value)] || 0).toDate(), 'dddd')
        break
      case 'isoyearisoweek':
      case 'week':
        date = new WrapDate(zeroedMoment(value).toDate(), 'W, D/MMM')
        break
      case 'quarter':
        date = new WrapDate(zeroedMoment(value).toDate(), 'MMMM/YY')
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

        date = new WrapDate(date, 'HH:mm')

        break
    }

    if (date) {
      date.setValue(value)
      return date
    }

    return value
  }

  return map(result, row => mapValues(row, eachAttribute))
}
