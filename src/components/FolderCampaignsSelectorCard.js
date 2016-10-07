import csjs from 'csjs'
import forEach from 'lodash/forEach'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'
import ReactDOM from 'react-dom'
import Fence from './Fence'

import {Form, Content, Header, Footer} from './Card'
import {styled} from './mixins/styled'

const style = csjs`
.content {
  height: 50vh
}`

const {PropTypes} = React

export const FolderCampaignsSelector = React.createClass({
  displayName: 'Campaigns-Selector',
  mixins: [styled(style)],
  propTypes: {
    isLoading: PropTypes.bool,
    headerColor: PropTypes.string,
    headerTextColor: PropTypes.string,
    title: PropTypes.node,
    label: PropTypes.string,
    children: PropTypes.node,
    onSelected: PropTypes.func
  },
  contextTypes: {
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
  getDefaultProps () {
    return {
      headerColor: 'primary',
      headerTextColor: 'white'
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
    const op = selected ? 'programaticallyUncheck' : 'programaticallyCheck'

    forEach(form.elements, el => {
      if (typeof el[op] === 'function') {
        el[op]()
      }
    })

    this.setState({selected: !selected})
  },
  render () {
    const {selected} = this.state
    const {messages: {selectAllCampaigns, deselectAllCampaigns}} = this.context
    const {isLoading, headerColor, headerTextColor, title, children, label} = this.props

    return (
      <Form ref='form' size='large' onSubmit={this.handleSubmit}>
        <Header color={headerColor} textColor={headerTextColor}>
          {title}
        </Header>

        <Content className={`mdl-list ${style.content}`} tag='ul'>
          {children}
        </Content>
        <Fence APEditCampaigns>
          <Footer multipleButtons>
            {isLoading && (
              <button type='button' disabled className='mdl-button mdl-button--colored mdl-color-text--grey-600'>
                <Message>loadingCampaigns</Message>
              </button>)}

            {!isLoading && (
              <button type='submit' className='mdl-button mdl-button--colored'>
                {label}
              </button>)}

            {!isLoading && (
              <a onClick={this.toggleAll} className='mdl-button mdl-button--colored'>
                {selected ? deselectAllCampaigns : selectAllCampaigns}
              </a>)}
          </Footer>
        </Fence>
      </Form>
    )
  }
})

export default FolderCampaignsSelector
