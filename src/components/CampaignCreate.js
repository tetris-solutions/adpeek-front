import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'

const {PropTypes} = React

export const CreateCampaign = React.createClass({
  displayName: 'Create-Campaign',
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
  handleSubmit (e) {
    e.preventDefault()
    const {dispatch} = this.props

    return dispatch(function (tree) {
      tree.push('alerts', new Error('Not implemented'))
    })
  },
  render () {
    const {errors} = this.state
    return (
      <form className='mdl-card mdl-shadow--6dp FloatingCardForm' onSubmit={this.handleSubmit}>
        <header className='mdl-card__title mdl-color--primary mdl-color-text--white'>
          <h3 className='mdl-card__title-text'>
            <Message>newCampaignHeader</Message>
          </h3>
        </header>

        <section className='mdl-card__supporting-text'>
          <Input label='name' name='name' error={errors.name}/>
        </section>

        <footer className='mdl-card__actions mdl-card--border'>
          <button type='submit' className='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>
            <Message>newCampaignCallToAction</Message>
          </button>
        </footer>
      </form>
    )
  }
})

export default branch({}, CreateCampaign)
