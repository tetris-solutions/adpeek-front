import compact from 'lodash/compact'
import join from 'lodash/join'

export function stringifyAddressComponents (addr) {
  addr = addr || {}

  return join(compact([
    addr.streetAddress,
    addr.streetNumber,
    addr.neighborhood,
    addr.cityName,
    addr.provinceCode,
    addr.countryCode
  ]), ', ')
}
