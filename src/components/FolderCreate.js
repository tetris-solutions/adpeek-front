import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {createFolderAction} from '../actions/create-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'
import Select from './Select'
import map from 'lodash/map'

const {PropTypes} = React

export const CreateFolder = React.createClass({
  displayName: 'Create-Folder',
  mixins: [FormMixin],
  propTypes: {
    dispatch: PropTypes.func,
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
      account: elements.account.value
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
    const {errors} = this.state
    const {accounts} = this.context.workspace
    return (
      <form className='mdl-card mdl-shadow--6dp FloatingCardForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>newFolderHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name' name='name' error={errors.name}/>
          <Select name='account' label='externalAccount' error={errors.account}>
            <option value=''></option>

            {map(accounts,
              ({id, platform, name}, index) =>
                <option key={index} value={id}>{`${platform} :: ${name}`}</option>)}
          </Select>
        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button type='submit' className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>
            <Message>newFolderCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default branch({}, CreateFolder)
