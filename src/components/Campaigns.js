import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import {unlinkCampaignAction} from '../actions/unlink-campaign'
import {linkCampaignAction} from '../actions/link-campaign'
import {loadCampaignsAction} from '../actions/load-campaigns'
import {loadLooseCampaignsAction} from '../actions/load-loose-campaigns'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {branch} from 'baobab-react/dist-modules/higher-order'
import CampaignLoose from './CampaignLoose'
import Campaign from './Campaign'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

const Campaigns = React.createClass({
  displayName: 'Campaigns',
  propTypes: {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      looseCampaigns: PropTypes.array,
      campaigns: PropTypes.array
    }),
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    })
  },
  reload () {
    const {dispatch, params: {company, workspace, folder}} = this.props

    return Promise.resolve()
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => Promise.all([
        dispatch(loadCampaignsAction, company, workspace, folder),
        dispatch(loadLooseCampaignsAction, company, workspace, folder)
      ]))
  },
  link (campaign) {
    const {dispatch, params: {folder, company, workspace}} = this.props

    dispatch(linkCampaignAction, company, workspace, folder, campaign)
      .then(this.reload)
  },
  unlink (campaign) {
    const {dispatch, params: {folder, company, workspace}} = this.props

    dispatch(unlinkCampaignAction, company, workspace, folder, campaign)
      .then(this.reload)
  },
  render () {
    const {folder, params: {company, workspace}} = this.props

    return (
      <div>
        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--7-col'>
            <ul className='mdl-list'>

              {map(folder.campaigns, (campaign, index) =>
                <Campaign key={campaign.id} {...campaign} unlinkCampaign={this.unlink}/>)}
            </ul>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <ul className='mdl-list'>

              {map(folder.looseCampaigns, (campaign, index) =>
                <CampaignLoose key={campaign.external_id} {...campaign} linkCampaign={this.link}/>)}
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

export default branch({}, contextualize(Campaigns, 'folder'))
