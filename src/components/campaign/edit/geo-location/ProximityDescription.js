import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import PrettyNumber from '../../../PrettyNumber'
import {stringifyAddressComponents} from '../../../../functions/stringify-address'

const unitAbbr = {
  KILOMETERS: 'km',
  MILES: 'mi'
}

const ProximityDescription = ({address, radius, unit, lat, lng}) => (
  <span>
    <PrettyNumber>
      {radius}
    </PrettyNumber>

    {` ${unitAbbr[unit]} `}

    <Message location={address
      ? stringifyAddressComponents(address)
      : `{${lat}°, ${lng}°}`}>closeToLocation</Message>
  </span>
)

ProximityDescription.displayName = 'Proximity-Description'
ProximityDescription.propTypes = {
  address: PropTypes.object,
  lat: PropTypes.number,
  lng: PropTypes.number,
  unit: PropTypes.oneOf(['KILOMETERS', 'MILES']),
  radius: PropTypes.number
}

export default ProximityDescription
