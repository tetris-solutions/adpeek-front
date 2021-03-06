import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import Message from '@tetris/front-server/Message'
import React from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import Fence from '../../Fence'
import FolderCampaignLi from './Item'
import FolderCampaignLooseLi from './LooseItem'
import FolderCampaignsHeader from './Header'
import FolderCampaignsSelector from './SelectorCard'
import {linkCampaignsAction} from '../../../actions/link-campaigns'
import {loadFolderCampaignsAction} from '../../../actions/load-folder-campaigns'
import {loadLooseCampaignsAction} from '../../../actions/load-loose-campaigns'
import {unlinkCampaignsAction} from '../../../actions/unlink-campaign'
import Page from '../../Page'

const cleanStr = str => deburr(lowerCase(str))
const hasFolder = ({folder}) => folder ? 1 : 0

class FolderCampaigns extends React.Component {
  static displayName = 'Folder-Campaigns'

  static propTypes = {
    dispatch: PropTypes.func,
    folder: PropTypes.shape({
      id: PropTypes.string,
      looseCampaigns: PropTypes.array,
      campaigns: PropTypes.array
    }),
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string,
      folder: PropTypes.string
    })
  }

  static contextTypes = {
    messages: PropTypes.shape({
      unlinkCampaignsCallToAction: PropTypes.string,
      linkCampaignsCallToAction: PropTypes.string
    })
  }

  state = {
    isLoading: true
  }

  componentDidMount () {
    this.setupActions()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.folder !== nextProps.params.folder) {
      this.setupActions(nextProps)
    }
  }

  setupActions = (props = this.props) => {
    const {dispatch, params: {folder, company, workspace}} = props

    const loadLoose = () => {
      this.setState({isLoading: true})

      return dispatch(loadLooseCampaignsAction, company, workspace, folder)
        .then(() => this.setState({isLoading: false}), err => {
          this.setState({isLoading: false})
          throw err
        })
    }

    function reload () {
      return Promise.all([
        dispatch(loadFolderCampaignsAction, company, workspace, folder),
        loadLoose()
      ])
    }

    function executeAction (action) {
      function invoke (campaigns) {
        return dispatch(action, company, workspace, folder, campaigns).then(reload)
      }

      return invoke
    }

    this.link = executeAction(linkCampaignsAction)
    this.unlink = executeAction(unlinkCampaignsAction)

    loadLoose()
  }

  setFilterValue = (filterValue) => {
    this.setState({filterValue})
  }

  refreshCampaigns = () => {
    const {dispatch, params: {folder, company, workspace}} = this.props

    this.setState({isRefreshing: true})

    return dispatch(loadFolderCampaignsAction, company, workspace, folder, 'refresh-campaigns')
      .then(() => this.setState({isRefreshing: false}), err => {
        this.setState({isRefreshing: false})
        throw err
      })
  }

  render () {
    const {isRefreshing, filterValue, isLoading} = this.state
    const value = cleanStr(filterValue)
    const {messages} = this.context
    const {folder, params: {company, workspace}} = this.props
    const match = ({external_id, name}) => !value || includes(external_id, value) || includes(cleanStr(name), value)
    const linked = filter(folder.campaigns, match)
    const loose = filter(folder.looseCampaigns, match)

    return (
      <div>
        <FolderCampaignsHeader
          company={company}
          workspace={workspace}
          folder={folder.id}
          onClickRefresh={this.refreshCampaigns}
          isLoading={isRefreshing}
          onChange={this.setFilterValue}/>

        <Fence canEditCampaign>{({canEditCampaign}) =>
          <Page>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--7-col'>
                <FolderCampaignsSelector
                  renderer={FolderCampaignLi}
                  onSelected={this.unlink}
                  campaigns={linked}
                  readOnly={!canEditCampaign}
                  title={<Message n={String(linked.length)}>nCampaigns</Message>}
                  label={messages.unlinkCampaignsCallToAction}/>
              </div>
              <div className='mdl-cell mdl-cell--5-col'>
                <FolderCampaignsSelector
                  isLoading={isLoading}
                  renderer={FolderCampaignLooseLi}
                  headerColor='grey-600'
                  campaigns={sortBy(loose, hasFolder)}
                  readOnly={!canEditCampaign}
                  onSelected={this.link}
                  title={<Message n={String(loose.length)}>nLooseCampaigns</Message>}
                  label={messages.linkCampaignsCallToAction}/>
              </div>
            </div>
          </Page>}
        </Fence>
      </div>
    )
  }
}

export default FolderCampaigns
