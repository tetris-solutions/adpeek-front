import React from 'react'
import Checkbox from './Checkbox'

const {PropTypes} = React

const CampaignLoose = React.createClass({
  displayName: 'Campaign',
  propTypes: {
    unlinkCampaign: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string
  },
  unlink () {
    this.props.unlinkCampaign(this.props.id)
  },
  render () {
    const {id, name} = this.props
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar'>person</i>
          {name}
        </span>
        <span className='mdl-list__item-secondary-action'>
          <Checkbox name={id} onChange={this.unlink} checked/>
        </span>
      </li>
    )
  }
})

export default CampaignLoose
