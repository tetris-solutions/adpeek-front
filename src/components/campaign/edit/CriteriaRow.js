import React from 'react'
import PropTypes from 'prop-types'
import Input from '../../Input'
import capitalize from 'lodash/capitalize'
import ProximityDescription from './ProximityDescription'

class CriteriaRow extends React.PureComponent {
  static displayName = 'Criteria-Row'
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    const {id, name, type, location_type} = this.props

    return (
      <tr>
        <td className='mdl-data-table__cell--non-numeric'>
          {name || <ProximityDescription {...this.props}/>}
        </td>
        <td className='mdl-data-table__cell--non-numeric'>
          {location_type || capitalize(type)}
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
