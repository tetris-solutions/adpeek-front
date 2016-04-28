import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {createFolderAction} from '../actions/create-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'
import {Form, Content, Header, Footer} from './FloatingForm'

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
    })
  },
  contextTypes: {
    router: PropTypes.object,
    workspace: PropTypes.object
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
      tag: elements.tag.value,
      media: elements.media.value
    }

    this.preSubmit()

    return dispatch(createFolderAction, company, workspace, folder)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => {
        this.context.router.push(`/company/${company}/workspace/${workspace}`)
      })
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {medias} = this.props
    const {errors} = this.state
    const {accounts} = this.context.workspace

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
            onChange={this.dismissError}>

            <option value=''/>

            {map(medias,
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
            onChange={this.dismissError}/>
        </Content>

        <Footer>
          <Message>newFolderCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default branch({medias: ['medias']}, CreateFolder)
