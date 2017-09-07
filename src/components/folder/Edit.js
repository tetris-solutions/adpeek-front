import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import pick from 'lodash/pick'
import FormMixin from '../mixins/FormMixin'
import Message from '@tetris/front-server/Message'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import Checkbox from '../Checkbox'
import {Submit} from '../Button'
import Input from '../Input'
import Select from '../Select'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {updateFolderAction} from '../../actions/update-folder'
import {Form, Content, Header, Footer} from '../Card'
import {many} from '../higher-order/branch'
import FolderFormMixin from '../mixins/FolderForm'
import AutoSuggest from '../AutoSuggest'
import Page from '../Page'
import SubHeader from '../SubHeader'
import {loadFolderCampaignsAction} from '../../actions/load-folder-campaigns'

const EditFolder = createReactClass({
  displayName: 'Edit-Folder',
  mixins: [FormMixin, FolderFormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    company: PropTypes.object,
    medias: PropTypes.array,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    kpis: PropTypes.object,
    folder: PropTypes.shape({
      id: PropTypes.string,
      account: PropTypes.object,
      name: PropTypes.string,
      tag: PropTypes.string,
      workspace_account: PropTypes.string,
      media: PropTypes.string,
      kpi: PropTypes.string
    }),
    workspace: PropTypes.shape({
      accounts: PropTypes.object
    })
  },
  contextTypes: {
    router: PropTypes.object
  },
  componentWillMount () {
    this.setState(pick(this.props.folder, [
      'name',
      'tag',
      'workspace_account',
      'media',
      'kpi',
      'kpi_goal'
    ]))
  },
  componentDidMount () {
    if (!this.isAnalytics) {
      this.loadKPI()
    }
  },
  /**
   * handles submit event
   * @param {Event} e submit event
   * @returns {Promise} promise that resolves once action is complete
   */
  handleSubmit (e) {
    e.preventDefault()
    const {target: {elements}} = e
    const {params: {company, workspace}, folder: {id}} = this.props
    const {dashCampaign, gaSegment} = this.state
    const {dispatch} = this.props
    const folder = {
      id,
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      dash_campaign: dashCampaign ? dashCampaign.id : '',
      ga_segment: gaSegment || null,
      tag: get(elements, 'tag.value', null),
      media: get(elements, 'media.value', null),
      kpi: this.state.kpi,
      kpi_goal: this.state.kpi_goal
    }

    if (this.isAnalytics()) {
      folder.media = 'display'
      folder.kpi = 'cpa'
      folder.ga_segment = folder.ga_segment || this.DEFAULT_GA_SEGMENT
    }

    if (folder.tag) {
      folder.searchTagsRightAway = elements.searchTagsRightAway.checked
    }

    this.preSubmit()

    const navigateToUpdatedFolder = () => this.context.router.push(`/c/${company}/w/${workspace}/f/${id}`)
    const reloadCampaigns = () => dispatch(loadFolderCampaignsAction, company, workspace, id)

    return dispatch(updateFolderAction, company, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(folder.searchTagsRightAway ? reloadCampaigns : undefined)
      .then(navigateToUpdatedFolder)
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {messages} = this.context
    const {medias, company, workspace: {accounts}} = this.props
    const {
      errors,
      kpi,
      kpi_goal,
      name,
      workspace_account,
      dashCampaign,
      gaSegment,
      media,
      tag
    } = this.state
    const hasAnalytics = this.hasAnalytics()
    const isAnalytics = this.isAnalytics()

    return (
      <div>
        <SubHeader/>
        <Page>
          <Form onSubmit={this.handleSubmit}>
            <Header>
              <Message>editFolderHeader</Message>
            </Header>

            <Content>
              <Input
                label='name'
                name='name'
                error={errors.name}
                value={name}
                onChange={this.onChangeInput}/>

              <Select
                disabled
                name='workspace_account'
                label='externalAccount'
                error={errors.workspace_account}
                value={workspace_account}>

                <option value=''/>

                {map(accounts,
                  ({id, platform, name}, index) => (
                    <option key={index} value={id}>
                      {`${platform} :: ${name}`}
                    </option>
                  ))}

              </Select>

              {!isAnalytics && (
                <Select
                  name='media'
                  label='media'
                  error={errors.media}
                  value={media}
                  onChange={this.onChangeInput}>

                  <option value=''/>

                  {map(medias,
                    ({id, name}, index) => (
                      <option key={index} value={id}>
                        {name}
                      </option>
                    ))}
                </Select>)}

              {!isAnalytics && (
                <Select
                  name='kpi'
                  label='kpi'
                  error={errors.kpi}
                  value={kpi}
                  onChange={this.onChangeInput}>

                  <option value=''/>

                  {map(get(find(medias, {id: media}), 'kpis'),
                    ({id, name, disabled}, index) => (
                      <option key={index} value={id} disabled={disabled}>
                        {name}
                      </option>
                    ))}
                </Select>)}

              {!isAnalytics && (
                <Input
                  type='number'
                  label='kpiGoal'
                  name='kpi_goal'
                  value={kpi_goal}
                  format={this.getKPIFormat()}
                  onChange={this.onChangeInput}/>)}

              {this.isConnectedToDash() && (
                <AutoSuggest
                  disabled={this.state.isLoadingDashCampaigns}
                  placeholder={messages.dashCampaignLabel}
                  onChange={this.onChangeDashCampaign}
                  options={map(company.dashCampaigns, this.normalizeDashCampaignOption)}
                  selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}/>
              )}

              {hasAnalytics ? (
                <AutoSuggest
                  selected={gaSegment ? this.normalizeAutoSuggestOption(gaSegment) : null}
                  onChange={this.onChangeSegment}
                  placeholder={messages.gaSegmentLabel}
                  options={this.getSegments()}/>
              ) : null}

              {isAnalytics && !gaSegment ? (
                <p>
                  <Message>defaultGASegmentAlert</Message>
                </p>
              ) : null}

              {gaSegment && gaSegment.definition ? (
                <p style={{wordBreak: 'break-all'}}>
                  <em>
                    {gaSegment.definition}
                  </em>
                </p>
              ) : null}

              {!isAnalytics && (
                <Input
                  name='tag'
                  label='folderTag'
                  error={errors.tag}
                  value={tag || ''}
                  onChange={this.onChangeInput}/>)}

              <br/>

              {!isAnalytics && tag && (
                <Checkbox
                  checked
                  label={<Message>autoLinkRightAway</Message>}
                  name='searchTagsRightAway'/>)}
            </Content>

            <Footer>
              <Submit className='mdl-button mdl-button--colored'>
                <Message>save</Message>
              </Submit>
            </Footer>
          </Form>
        </Page>
      </div>
    )
  }
})

export default many([
  {
    kpis: ['kpis'],
    medias: ['medias']
  },
  ['user', 'company'],
  ['workspace', 'folder'],
  ['company', 'workspace']
], EditFolder)
