import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {createFolderAction} from '../actions/create-folder'
import {pushSuccessMessageAction} from '../actions/push-success-message-action'

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
    router: PropTypes.object
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

    this.preSubmit()

    return dispatch(createFolderAction, company, workspace, elements.name.value)
      .then(() => dispatch(pushSuccessMessageAction))
      .then(() => {
        this.context.router.push(`/company/${company}/workspace/${workspace}`)
      })
      .catch(this.handleSubmitException)
      .then(this.posSubmit)
  },
  render () {
    const {errors} = this.state
    return (
      <form className='mdl-card mdl-shadow--6dp WrkCreateForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>newFolderHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name' name='name' error={errors.name}/>
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
