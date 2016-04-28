import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {updateFolderAction} from '../actions/update-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

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
    folder: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      tag: PropTypes.string,
      workspace_account: PropTypes.string,
      media: PropTypes.string
    }),
    workspace: PropTypes.shape({
      accounts: PropTypes.array
    })
  },
  componentWillMount () {
    this.setState(pick(this.context.folder, [
      'name',
      'tag',
      'workspace_account',
      'media'
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
    const {params: {company, workspace}} = this.props
    const {dispatch} = this.props
    const {folder: {id}} = this.context
    const folder = {
      id,
      name: elements.name.value,
      workspace_account: elements.workspace_account.value,
      tag: elements.tag.value,
      media: elements.media.value
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
    const {medias} = this.props
    const {errors, name, workspace_account, media, tag} = this.state
    const {workspace: {accounts}} = this.context

    return (
      <form className='mdl-card mdl-shadow--6dp FloatingCardForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>editFolderHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name' name='name' error={errors.name} value={name} onChange={this.saveAndDismiss('name')}/>

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

          <Input
            name='tag'
            label='tag'
            error={errors.tag}
            value={tag}
            onChange={this.saveAndDismiss('tag')}/>

        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button type='submit' className='mdl-button mdl-button--colored'>
            <Message>saveCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default branch({
  medias: ['medias']
}, CreateFolder)
