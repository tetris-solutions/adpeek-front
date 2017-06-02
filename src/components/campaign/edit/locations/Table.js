import React from 'react'
import PropTypes from 'prop-types'
import {style} from '../style'
import map from 'lodash/map'

const LocationsTable = ({locations}) => (
  <table className={`mdl-data-table ${style.table}`}>
    <thead>
      <tr>
        <th className='mdl-data-table__cell--non-numeric'>
          BusinessName
        </th>
        <th className='mdl-data-table__cell--non-numeric'>
          AddressLine1
        </th>
        <th className='mdl-data-table__cell--non-numeric'>
          City
        </th>
        <th>
          PhoneNumber
        </th>
      </tr>
    </thead>
    <tbody>{map(locations, l =>
      <tr key={l.feedItemId}>
        <td className='mdl-data-table__cell--non-numeric'>
          {l.businessName}
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          {l.addressLine1}
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          {l.city}
        </td>
        <td>
          {l.phoneNumber}
        </td>
      </tr>)}
    </tbody>
  </table>
)

LocationsTable.displayName = 'Locations-Table'
LocationsTable.propTypes = {
  locations: PropTypes.array.isRequired
}

export default LocationsTable
