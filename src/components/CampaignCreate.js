import React from 'react'
import FormMixin from '@tetris/front-server/lib/mixins/FormMixin'
import Message from '@tetris/front-server/lib/components/intl/Message'
import Input from './Input'
import {branch} from 'baobab-react/dist-modules/higher-order'
import {Form, Content, Header, Footer} from './Card'

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
      <Form onSubmit={this.handleSubmit}>
        <Header>
          <Message>newCampaignHeader</Message>
        </Header>

        <Content>
          <Input label='name' name='name' error={errors.name}/>
        </Content>

        <Footer>
          <Message>newCampaignCallToAction</Message>
        </Footer>
      </Form>
    )
  }
})

export default branch({}, CreateCampaign)
