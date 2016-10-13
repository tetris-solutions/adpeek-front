import React from 'react'
import FormMixin from './mixins/FormMixin'
import Message from 'tetris-iso/Message'
import Input from './Input'
import {createFolderAction} from '../actions/create-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'
import find from 'lodash/find'
import get from 'lodash/get'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'
import Checkbox from './Checkbox'

const {PropTypes} = React

export const CreateFolder = React.createClass({
  displayName: 'Create-Folder',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
    medias: PropTypes.array,
    params: PropTypes.shape({
      company: PropTypes.string,
      workspace: PropTypes.string
    }),
    workspace: PropTypes.shape({
      accounts: PropTypes.object
    })
  },
  contextTypes: {
    router: PropTypes.object
  },
  getInitialState () {
    return {
      showTagCheckbox: false,
      selectedMedia: ''
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
    const {params: {company, workspace}} = this.props
    const {dispatch} = this.props
    const folder = {
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      tag: elements.tag.value || null,
      media: elements.media.value,
      kpi: elements.kpi.value
    }

    if (folder.tag) {
      folder.searchTagsRightAway = elements.searchTagsRightAway.checked
    }

    this.preSubmit()

    const navigateToFolderList = () => this.context.router.push(`/company/${company}/workspace/${workspace}`)

    return dispatch(createFolderAction, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(navigateToFolderList)
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  onChangeMedia (e) {
    this.dismissError(e)

    this.setState({
      selectedMedia: e.target.value
    })
  },
  onChangeTag (e) {
    this.dismissError(e)

    this.setState({
      showTagCheckbox: Boolean(e.target.value)
    })
  },
  render () {
    const {medias, workspace: {accounts}} = this.props
    const {errors, selectedMedia, showTagCheckbox} = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message>newFolderHeader</Message>
        </Header>

        <Content>
          <Input
            label='name'
            name='name'
            error={errors.name}
            onChange={this.dismissError}/>

          <Select
            name='workspace_account'
            label='externalAccount'
            error={errors.workspace_account}
            onChange={this.dismissError}>

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
            value={selectedMedia}
            onChange={this.onChangeMedia}>

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
            onChange={this.dismissError}>

            <option value=''/>

            {map(get(find(medias, {id: selectedMedia}), 'kpis'),
              ({id, name}, index) => (
                <option key={index} value={id}>
                  {name}
                </option>
              ))}
          </Select>

          <Input
            name='tag'
            label='folderTag'
            error={errors.tag}
            onChange={this.onChangeTag}/>

          <br/>

          {showTagCheckbox && (
            <Checkbox
              checked
              label={<Message>autoLinkRightAway</Message>}
              name='searchTagsRightAway'/>)}

        </Content>

        <Footer>
          <Message>newFolderCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(CreateFolder, {medias: ['medias']}, 'workspace')
