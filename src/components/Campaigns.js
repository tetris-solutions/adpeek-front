import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import {linkCampaignAction} from '../actions/link-campaign'
import {loadCampaignsAction} from '../actions/load-campaigns'
import {loadLooseCampaignsAction} from '../actions/load-loose-campaigns'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {branch} from 'baobab-react/dist-modules/higher-order'
import CampaignLoose from './CampaignLoose'
import Campaign from './Campaign'

const {PropTypes} = React

const Campaigns = React.createClass({
  displayName: 'Campaigns',
  propTypes: {
    dispatch: PropTypes.func,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    })
  },
  contextTypes: {
    folder: PropTypes.shape({
      looseCampaigns: PropTypes.array,
      campaigns: PropTypes.array
    })
  },
  link (campaign) {
    const {dispatch, params: {company, workspace, folder}} = this.props

    dispatch(linkCampaignAction, company, workspace, folder, campaign)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => Promise.all([
        dispatch(loadCampaignsAction, company, workspace, folder),
        dispatch(loadLooseCampaignsAction, company, workspace, folder)
      ]))
  },
  unlink (campaign) {

  },
  render () {
    const {params: {company, workspace}} = this.props
    const {folder} = this.context

    return (
      <div>
        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--7-col'>
            <ul className='mdl-list'>

              {map(folder.campaigns, (campaign, index) =>
                <Campaign key={index} {...campaign} unlinkCampaign={this.unlink}/>)}
            </ul>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <ul className='mdl-list'>

              {map(folder.looseCampaigns, (campaign, index) =>
                <CampaignLoose key={index} {...campaign} linkCampaign={this.link}/>)}
            </ul>
          </div>
        </div>

        <hr/>
        <Link to={`/company/${company}/workspace/${workspace}/folder/${folder.id}/create/campaign`}>
          CREATE NEW
        </Link>
      </div>
    )
  }
})

export default branch({}, Campaigns)
