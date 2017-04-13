import find from 'lodash/find'
import assign from 'lodash/assign'
import get from 'lodash/get'
import map from 'lodash/map'
import pick from 'lodash/pick'
import FormMixin from '../mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import Checkbox from '../Checkbox'
import Input from '../Input'
import Select from '../Select'
import {pushSuccessMessageAction} from '../../actions/push-success-message-action'
import {updateFolderAction} from '../../actions/update-folder'
import {Form, Content, Header, Footer} from '../Card'
import {many} from '../higher-order/branch'
import FolderFormMixin from '../mixins/FolderForm'
import AutoSelect from '../AutoSelect'
import Page from '../Page'
import SubHeader from '../SubHeader'

export const EditFolder = createReactClass({
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
      ga_segment: null,
      tag: get(elements, 'tag.value', null),
      media: get(elements, 'media.value', null),
      kpi: this.state.kpi,
      kpi_goal: this.state.kpi_goal
    }

    if (this.isAnalytics()) {
      folder.media = 'display'
      folder.kpi = 'cpa'
    }

    if (gaSegment) {
      folder.ga_segment = assign({}, gaSegment)
      folder.ga_segment.id = folder.ga_segment.id === this.CREATE_OPTION_FLAG
        ? null
        : folder.ga_segment.id
    }

    if (folder.tag) {
      folder.searchTagsRightAway = elements.searchTagsRightAway.checked
    }

    this.preSubmit()

    const navigateToUpdatedFolder = () => this.context.router.push(`/company/${company}/workspace/${workspace}/folder/${id}`)

    return dispatch(updateFolderAction, company, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
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
                onChange={this.saveAndDismiss('name')}/>

              <Select
                disabled
                name='workspace_account'
                label='externalAccount'
                error={errors.workspace_account}
                value={workspace_account}
                onChange={this.saveAndDismiss('workspace_account')}>

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
                  onChange={this.saveAndDismiss('media')}>

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
                  onChange={this.saveAndDismiss('kpi')}>

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
                  onChange={this.saveAndDismiss('kpi_goal')}/>)}

              {this.isConnectedToDash() && (
                <AutoSelect
                  disabled={this.state.isLoadingDashCampaigns}
                  placeholder={messages.dashCampaignLabel}
                  onChange={this.onChangeDashCampaign}
                  options={map(company.dashCampaigns, this.normalizeDashCampaignOption)}
                  selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}/>
              )}

              {accounts.analytics
                ? (
                  <AutoSelect
                    selected={gaSegment ? this.normalizeAutoSelectOpt(gaSegment) : null}
                    onChange={this.onChangeSegment}
                    placeholder={messages.gaSegmentLabel}
                    options={this.getSegments()}/>
                ) : null}

              {gaSegment
                ? (
                  <Input
                    disabled={gaSegment.id !== this.CREATE_OPTION_FLAG}
                    name='segmentDefinition'
                    label='gaSegmentDefinition'
                    value={gaSegment.definition}
                    error={errors.segmentDefinition}
                    onChange={this.onChangeSegmentDefinition}/>
                ) : null}

              {!isAnalytics && (
                <Input
                  name='tag'
                  label='folderTag'
                  error={errors.tag}
                  value={tag || ''}
                  onChange={this.saveAndDismiss('tag')}/>)}

              <br/>

              {!isAnalytics && tag && (
                <Checkbox
                  checked
                  label={<Message>autoLinkRightAway</Message>}
                  name='searchTagsRightAway'/>)}
            </Content>

            <Footer>
              <Message>save</Message>
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
