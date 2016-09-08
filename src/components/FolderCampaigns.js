import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import identity from 'lodash/identity'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import settle from 'promise-settle'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import Campaign from './FolderCampaignLi'
import CampaignLoose from './FolderCampaignLooseLi'
import CampaignsHeader from './FolderCampaignsHeader'
import CampaignsSelectorCard from './FolderCampaignsSelectorCard'
import {linkCampaignAction} from '../actions/link-campaign'
import {loadCampaignsAction} from '../actions/load-campaigns'
import {loadLooseCampaignsAction} from '../actions/load-loose-campaigns'
import {unlinkCampaignAction} from '../actions/unlink-campaign'
import {contextualize} from './higher-order/contextualize'

const cleanStr = str => deburr(lowerCase(str))
const {PropTypes} = React
const filterActive = ls => filter(ls, ({status: {is_active}}) => is_active)

export const FolderCampaigns = React.createClass({
  displayName: 'Folder-Campaigns',
  propTypes: {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      looseCampaigns: PropTypes.array,
      campaigns: PropTypes.array
    }),
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  },
  contextTypes: {
    messages: PropTypes.shape({
      unlinkCampaignsCallToAction: PropTypes.string,
      linkCampaignsCallToAction: PropTypes.string
    })
  },
  getInitialState () {
    return {
      filterActiveCampaigns: true,
      isLoading: false
    }
  },
  componentDidMount () {
    const {dispatch, params: {folder, company, workspace}} = this.props

    const loadLoose = () => {
      this.setState({isLoading: true})

      return dispatch(loadLooseCampaignsAction, company, workspace, folder)
        .then(r => {
          this.setState({isLoading: false})
          return r
        }, err => {
          this.setState({isLoading: false})
          throw err
        })
    }

    function reload () {
      return Promise.all([
        dispatch(loadCampaignsAction, company, workspace, folder),
        loadLoose()
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

    loadLoose()
  },
  setFilterValue (filterValue) {
    this.setState({filterValue})
  },
  switchActiveFilter (filterActiveCampaigns) {
    this.setState({filterActiveCampaigns})
  },
  refreshCampaigns () {
    const {dispatch, params: {folder, company, workspace}} = this.props

    this.setState({isRefreshing: true})

    return dispatch(loadCampaignsAction, company, workspace, folder, 'refresh-campaigns')
      .then(() => {
        this.setState({isRefreshing: false})
      }, err => {
        this.setState({isRefreshing: false})
        throw err
      })
  },
  render () {
    const {isRefreshing, filterValue, isLoading, filterActiveCampaigns} = this.state
    const value = cleanStr(filterValue)
    const {messages} = this.context
    const {folder, params: {company, workspace}} = this.props
    const filterValid = filterActiveCampaigns ? filterActive : identity
    const match = ({external_id, name}) => !value || includes(external_id, value) || includes(cleanStr(name), value)
    const linked = filter(folder.campaigns, match)
    const loose = filter(filterValid(folder.looseCampaigns), match)

    return (
      <div>
        <CampaignsHeader
          company={company}
          workspace={workspace}
          folder={folder.id}
          onClickRefresh={this.refreshCampaigns}
          isLoading={isRefreshing}
          onSwitch={this.switchActiveFilter}
          onChange={this.setFilterValue}/>
        <div className='mdl-grid'>

          <div className='mdl-cell mdl-cell--7-col'>
            <CampaignsSelectorCard
              onSelected={this.unlink}
              title={<Message n={String(linked.length)}>nCampaigns</Message>}
              label={messages.unlinkCampaignsCallToAction}>

              {map(linked, (campaign, index) =>
                <Campaign key={campaign.id} {...campaign}/>)}

            </CampaignsSelectorCard>

          </div>
          <div className='mdl-cell mdl-cell--5-col'>

            <CampaignsSelectorCard
              isLoading={isLoading}
              headerColor='grey-600'
              onSelected={this.link}
              title={<Message n={String(loose.length)}>nLooseCampaigns</Message>}
              label={messages.linkCampaignsCallToAction}>

              {map(loose, (campaign, index) =>
                <CampaignLoose key={campaign.external_id} {...campaign}/>)}

            </CampaignsSelectorCard>

          </div>
        </div>
      </div>
    )
  }
})

export default contextualize(FolderCampaigns, 'folder')
