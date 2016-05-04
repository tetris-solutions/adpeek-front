import React from 'react'
import forEach from 'lodash/forEach'

import {Form, Content, Header, Footer} from './FloatingForm'

const {PropTypes} = React

export const CampaignsToggle = React.createClass({
  displayName: 'CampaignListToggle',
  propTypes: {
    title: PropTypes.node,
    label: PropTypes.string,
    children: PropTypes.node,
    onSelected: PropTypes.func
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

    this.props.onSelected(values)
  },
  render () {
    const {title, children, label} = this.props
    return (
      <Form size='large' onSubmit={this.handleSubmit}>
        <Header>
          {title}
        </Header>

        <Content>
          <ul className='mdl-list'>
            {children}
          </ul>
        </Content>

        <Footer>
          {label}
        </Footer>
      </Form>
    )
  }
})

export default CampaignsToggle
