import React from 'react'
import ReactDOM from 'react-dom'
import forEach from 'lodash/forEach'
import {contextualize} from './higher-order/contextualize'

import {Form, Content, Header, Footer} from './FloatingForm'

const {PropTypes} = React

export const CampaignsToggle = React.createClass({
  displayName: 'CampaignListToggle',
  propTypes: {
    title: PropTypes.node,
    label: PropTypes.string,
    children: PropTypes.node,
    onSelected: PropTypes.func,
    messages: PropTypes.shape({
      selectAllCampaigns: PropTypes.string,
      deselectAllCampaigns: PropTypes.string
    })
  },
  getInitialState () {
    return {
      selected: false
    }
  },
  handleSubmit (e) {
    e.preventDefault()
    const values = []

    forEach(e.target.elements, ({name, checked, value}) => {
      if (checked) {
        values.push(JSON.parse(value))
      }
    })

    if (!values.length) return

    this.setState({selected: false})
    this.props.onSelected(values)
  },
  toggleAll (e) {
    e.preventDefault()

    const form = ReactDOM.findDOMNode(this.refs.form)
    const {selected} = this.state
    const op = selected ? 'uncheck' : 'check'

    forEach(form.elements, el => {
      if (el.type === 'checkbox') {
        el.parentNode.MaterialCheckbox[op]()
      }
    })

    this.setState({selected: !selected})
  },
  render () {
    const {selected} = this.state
    const {title, children, label, messages: {selectAllCampaigns, deselectAllCampaigns}} = this.props
    return (
      <Form ref='form' size='large' onSubmit={this.handleSubmit}>
        <Header>
          {title}
        </Header>

        <Content tag='ul' className='mdl-list'>
          {children}
        </Content>

        <Footer multipleButtons>
          <button type='submit' className='mdl-button mdl-button--colored'>
            {label}
          </button>

          <a onClick={this.toggleAll} className='mdl-button mdl-button--colored'>
            {selected ? deselectAllCampaigns : selectAllCampaigns}
          </a>
        </Footer>
      </Form>
    )
  }
})

export default contextualize(CampaignsToggle, 'messages')
