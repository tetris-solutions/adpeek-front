import React from 'react'
import Checkbox from './Checkbox'

const {PropTypes} = React

const CampaignLoose = React.createClass({
  displayName: 'Campaign-Loose',
  propTypes: {
    linkCampaign: PropTypes.func,
    external_campaign: PropTypes.string,
    name: PropTypes.string
  },
  link () {
    this.props.linkCampaign(this.props.external_campaign)
  },
  render () {
    const {external_campaign, name} = this.props
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar'>person</i>
          {name}
        </span>
        <span className='mdl-list__item-secondary-action'>
          <Checkbox name={external_campaign} onChange={this.link}/>
        </span>
      </li>
    )
  }
})

export default CampaignLoose
