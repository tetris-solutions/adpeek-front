import React from 'react'
import Checkbox from './Checkbox'
import {loadAdsetsAction} from '../actions/load-adsets'
import {branch} from 'baobab-react/dist-modules/higher-order'

const {PropTypes} = React

export const CampaignAdsets = React.createClass({
  displayName: 'Campaign-Adsets',
  propTypes: {
    dispatch: PropTypes.func,
    id: PropTypes.string,
    name: PropTypes.string,
    platform: PropTypes.string,
    adsets: PropTypes.array,
    status: PropTypes.shape({
      icon: PropTypes.string,
      description: PropTypes.string
    })
  },
  contextTypes: {
    params: PropTypes.object
  },
  componentDidMount () {
    const {params: {company, workspace, folder}} = this.context
    const {id, platform, adsets, dispatch} = this.props

    if (platform === 'facebook' && !adsets) {
      dispatch(loadAdsetsAction, company, workspace, folder, id)
    }
  },
  render () {
    const {id, name, status} = this.props
    return (
      <li className='mdl-list__item'>
        <span className='mdl-list__item-primary-content'>
          <i className='material-icons mdl-list__item-avatar' title={status.description}>
            {status.icon}
          </i>
          {name}
        </span>
        <span className='mdl-list__item-secondary-action'>
          <Checkbox name={id} value={JSON.stringify(id)}/>
        </span>
      </li>
    )
  }
})

export default branch({}, CampaignAdsets)
