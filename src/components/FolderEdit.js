import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import React from 'react'
import Checkbox from './Checkbox'
import Input from './Input'
import Select from './Select'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import {updateFolderAction} from '../actions/update-folder'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import FolderFormMixin from './mixins/FolderForm'
import AutoSelect from './AutoSelect'
import Page from './Page'
import SubHeader from './SubHeader'

const {PropTypes} = React

export const EditFolder = React.createClass({
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
    folder: PropTypes.shape({
      id: PropTypes.string,
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
      'kpi'
    ]))
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
    const {dispatch} = this.props
    const folder = {
      id,
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      dash_campaign: get(elements, 'dash_campaign.value', null),
      tag: elements.tag.value || null,
      media: elements.media.value,
      kpi: elements.kpi.value
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
  saveAndDismiss (name) {
    return ({target: {value}}) => {
      const errors = omit(this.state.errors, name)
      this.setState({errors, [name]: value})
    }
  },
  render () {
    const {medias, company, workspace: {accounts}} = this.props
    const {errors, kpi, name, workspace_account, dashCampaign, media, tag} = this.state

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
              </Select>

              <Select
                name='kpi'
                label='kpi'
                error={errors.kpi}
                value={kpi}
                onChange={this.saveAndDismiss('kpi')}>

                <option value=''/>

                {map(get(find(medias, {id: media}), 'kpis'),
                  ({id, name}, index) => (
                    <option key={index} value={id}>
                      {name}
                    </option>
                  ))}
              </Select>

              {this.isConnectedToDash() ? (
                <div>
                  <input type='hidden' name='dash_campaign' value={get(dashCampaign, 'id', '')}/>
                  <AutoSelect
                    disabled={this.state.isLoadingDashCampaigns}
                    placeholder={this.context.messages.dashCampaignLabel}
                    onChange={this.onChangeDashCampaign}
                    options={map(company.dashCampaigns, this.normalizeDashCampaignOption)}
                    selected={dashCampaign ? this.normalizeDashCampaignOption(dashCampaign) : null}/>
                </div>
              ) : null}

              <Input
                name='tag'
                label='folderTag'
                error={errors.tag}
                value={tag}
                onChange={this.saveAndDismiss('tag')}/>

              <br/>

              {tag && (
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

export default contextualize(EditFolder, {medias: ['medias']}, 'folder', 'workspace', 'company')
