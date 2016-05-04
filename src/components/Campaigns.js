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
import settle from 'promise-settle'
import Message from '@tetris/front-server/lib/components/intl/Message'
import SearchBox from './SearchBox'
import deburr from 'lodash/deburr'
import lowerCase from 'lodash/lowerCase'
import includes from 'lodash/includes'
import filter from 'lodash/filter'

const cleanStr = str => deburr(lowerCase(str))
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
  getInitialState () {
    return {}
  },
  componentWillMount () {
    const {dispatch, params: {folder, company, workspace}} = this.props

    function reload () {
      return Promise.all([
        dispatch(loadCampaignsAction, company, workspace, folder),
        dispatch(loadLooseCampaignsAction, company, workspace, folder)
      ])
    }

    function action (fn) {
      function invoke (campaigns) {
        const actions = campaigns.map(campaign => dispatch(fn, company, workspace, folder, campaign))
        return settle(actions).then(reload)
      }

      return invoke
    }

    this.link = action(linkCampaignAction)
    this.unlink = action(unlinkCampaignAction)
  },
  setFilterValue (filterValue) {
    this.setState({filterValue})
  },
  render () {
    const value = cleanStr(this.state.filterValue)
    const {folder, messages, params: {company, workspace}} = this.props
    const match = ({external_id, name}) => !value || includes(external_id, value) || includes(cleanStr(name), value)
    const linked = filter(folder.campaigns, match)
    const loose = filter(folder.looseCampaigns, match)

    return (
      <div>
        <header className='mdl-layout__header'>
          <div className='mdl-layout__header-row mdl-color--blue-grey-500'>
            <small>nope nope</small>
            <div className='mdl-layout-spacer'/>
            <SearchBox onEnter={this.setFilterValue}/>
          </div>
        </header>

        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--7-col'>
            <CampaignsToggle
              onSelected={this.unlink}
              title={<Message n={String(linked.length)}>nCampaigns</Message>}
              label={messages.unlinkCampaignsCallToAction}>

              {map(linked, (campaign, index) =>
                <Campaign key={campaign.id} {...campaign}/>)}

            </CampaignsToggle>

          </div>
          <div className='mdl-cell mdl-cell--5-col'>

            <CampaignsToggle
              onSelected={this.link}
              title={<Message n={String(loose.length)}>nLooseCampaigns</Message>}
              label={messages.linkCampaignsCallToAction}>

              {map(loose, (campaign, index) =>
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
