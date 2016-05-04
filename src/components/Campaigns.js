import React from 'react'
import map from 'lodash/map'
import {Link} from 'react-router'
import {unlinkCampaignAction} from '../actions/unlink-campaign'
import {linkCampaignAction} from '../actions/link-campaign'
import {loadCampaignsAction} from '../actions/load-campaigns'
import {loadLooseCampaignsAction} from '../actions/load-loose-campaigns'
import {branch} from 'baobab-react/dist-modules/higher-order'
import CampaignLoose from './CampaignLoose'
import Campaign from './Campaign'
import {contextualize} from './higher-order/contextualize'
import CampaignsToggle from './CampaignsToggle'

const {PropTypes} = React

export const Campaigns = React.createClass({
  displayName: 'Campaigns',
  propTypes: {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      looseCampaigns: PropTypes.array,
      campaigns: PropTypes.array
    }),
    messages: PropTypes.shape({
      unlinkCampaignsCallToAction: PropTypes.string,
      linkCampaignsCallToAction: PropTypes.string
    }),
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  componentWillMount () {
    const {dispatch, params: {folder, company, workspace}} = this.props

    this.reload = () => Promise.all([
      dispatch(loadCampaignsAction, company, workspace, folder),
      dispatch(loadLooseCampaignsAction, company, workspace, folder)
    ])

    function action (fn) {
      function invoke (campaign) {
        return dispatch(fn, company, workspace, folder, campaign)
      }

      return invoke
    }

    this.link = action(linkCampaignAction)
    this.unlink = action(unlinkCampaignAction)
  },
  render () {
    const {folder, messages: {linkCampaignsCallToAction, unlinkCampaignsCallToAction}, params: {company, workspace}} = this.props

    return (
      <div>
        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--7-col'>
            <CampaignsToggle action={this.unlink} after={this.reload} label={unlinkCampaignsCallToAction}>
              {map(folder.campaigns, (campaign, index) =>
                <Campaign key={campaign.id} {...campaign}/>)}
            </CampaignsToggle>
          </div>
          <div className='mdl-cell mdl-cell--5-col'>
            <CampaignsToggle action={this.link} after={this.reload} label={linkCampaignsCallToAction}>
              {map(folder.looseCampaigns, (campaign, index) =>
                <CampaignLoose key={campaign.external_id} {...campaign}/>)}
            </CampaignsToggle>
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

export default branch({}, contextualize(Campaigns, 'folder', 'messages'))
