import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {updateFolderAction} from '../actions/update-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import find from 'lodash/find'
import get from 'lodash/get'
import {Form, Content, Header, Footer} from './Card'
import {contextualize} from './higher-order/contextualize'

const {PropTypes} = React

export const EditFolder = React.createClass({
  displayName: 'Edit-Folder',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
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
      tag: elements.tag.value,
      media: elements.media.value,
      kpi: elements.kpi.value
    }

    this.preSubmit()

    return dispatch(updateFolderAction, company, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => {
        this.context.router.push(`/company/${company}/workspace/${workspace}/folder/${id}`)
      })
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
    const {medias, workspace: {accounts}} = this.props
    const {errors, kpi, name, workspace_account, media, tag} = this.state

    return (
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

          <Input
            name='tag'
            label='tag'
            error={errors.tag}
            value={tag}
            onChange={this.saveAndDismiss('tag')}/>

        </Content>

        <Footer>
          <Message>saveCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(EditFolder, {medias: ['medias']}, 'folder', 'workspace')
