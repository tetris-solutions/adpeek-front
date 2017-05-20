import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import Input from '../../Input'
import PrettyNumber from '../../PrettyNumber'
import {stringifyAddressComponents} from '../../../functions/stringify-address'

const unitAbbr = {
  KILOMETERS: 'km',
  MILES: 'mi'
}

class CriteriaRow extends React.PureComponent {
  static displayName = 'Criteria-Row'
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    draft: PropTypes.bool,
    unit: PropTypes.oneOf(['KILOMETERS', 'MILES']),
    radius: PropTypes.number,
    address: PropTypes.object,
    change: PropTypes.func,
    remove: PropTypes.func,
    type: PropTypes.string,
    location_type: PropTypes.string,
    bid_modifier: PropTypes.number
  }

  change = changes => {
    this.props.change(this.props.id, changes)
  }

  onRemoveClick = e => {
    e.preventDefault()
    this.props.remove(this.props.id)
  }

  onChangeBidModifier = ({target: {value: bid_modifier}}) => {
    this.change({bid_modifier})
  }

  render () {
    const {id, name, address, radius, unit, lat, lng, type, location_type} = this.props

    return (
      <tr>
        <td className='mdl-data-table__cell--non-numeric'>
          {name || (
            <div>
              <PrettyNumber>
                {radius}
              </PrettyNumber>

              {` ${unitAbbr[unit]} `}

              <Message location={address
                ? stringifyAddressComponents(address)
                : `{${lat}°, ${lng}°}`}>closeToLocation</Message>
            </div>)}
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          {location_type || type}
        </td>
        <td>
          <div style={{width: '4em', float: 'right'}}>
            <Input
              name={`bid-modifier-${id}`}
              type='number'
              format='percentage'
              value={this.props.bid_modifier || 0}
              onChange={this.onChangeBidModifier}/>
          </div>
        </td>
        <td>
          <a href='' className='mdl-list__item-secondary-action' onClick={this.onRemoveClick}>
            <i className='material-icons'>close</i>
          </a>
        </td>
      </tr>
    )
  }
}

export default CriteriaRow