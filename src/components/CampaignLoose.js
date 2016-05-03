import React from 'react'
import Checkbox from './Checkbox'
import pick from 'lodash/pick'

const {PropTypes} = React

const CampaignLoose = React.createClass({
  displayName: 'Campaign-Loose',
  propTypes: {
    linkCampaign: PropTypes.func,
    external_id: PropTypes.string,
    name: PropTypes.string
  },
  link () {
    const campaign = pick(this.props, 'name', 'external_id', 'status', 'sub_status', 'platform')
    setTimeout(() => this.props.linkCampaign(campaign), 500)
  },
  render () {
    const {external_id, name} = this.props
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar'>person</i>
          {name}
        </span>
        <span className='mdl-list__item-secondary-action'>
          <Checkbox name={external_id} onChange={this.link}/>
        </span>
      </li>
    )
  }
})

export default CampaignLoose
