import csjs from 'csjs'
import forEach from 'lodash/forEach'
import Message from 'tetris-iso/Message'
import React from 'react'
import ReactDOM from 'react-dom'
import Fence from './Fence'
import map from 'lodash/map'
import size from 'lodash/size'
import {Form, Content, Header, Footer} from './Card'
import {styled} from './mixins/styled'
import groupBy from 'lodash/groupBy'

const style = csjs`
.content {
  height: 50vh
}`

const {PropTypes} = React

const InactiveCampaigns = React.createClass({
  displayName: 'Inactive-Campaigns',
  propTypes: {
    campaigns: PropTypes.array.isRequired,
    renderer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  getInitialState () {
    return {
      isExpanded: false
    }
  },
  toggle () {
    this.setState({isExpanded: !this.state.isExpanded})
  },
  render () {
    const {isExpanded} = this.state
    const {campaigns, readOnly, renderer: Component} = this.props
    const msgName = isExpanded ? 'hideNCampaigns' : 'showNCampaigns'
    const count = size(campaigns)

    if (!count) return null

    return (
      <section>
        <p style={{textAlign: 'center'}}>
          <button type='button' className='mdl-button' onClick={this.toggle}>
            <Message count={String(count)}>{msgName}</Message>
          </button>
        </p>

        {map(isExpanded && campaigns, campaign => (
          <Component
            {...campaign}
            key={campaign.id || campaign.external_id}
            readOnly={readOnly}/>
        ))}
      </section>
    )
  }
})

export const FolderCampaignsSelector = React.createClass({
  displayName: 'Campaigns-Selector',
  mixins: [styled(style)],
  propTypes: {
    campaigns: PropTypes.array.isRequired,
    renderer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    headerColor: PropTypes.string,
    headerTextColor: PropTypes.string,
    title: PropTypes.node,
    label: PropTypes.string,
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
      selected: false,
      activeOnly: false
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
    const {
      readOnly,
      campaigns,
      isLoading,
      headerColor,
      headerTextColor,
      title,
      renderer: Component,
      label
    } = this.props
    const grouped = groupBy(campaigns, 'status.is_active')

    return (
      <Form ref='form' size='large' onSubmit={this.handleSubmit}>
        <Header color={headerColor} textColor={headerTextColor}>
          {title}
        </Header>

        <Content className={`mdl-list ${style.content}`} tag='ul'>
          {map(grouped.true, campaign => (
            <Component
              {...campaign}
              key={campaign.id || campaign.external_id}
              readOnly={readOnly}/>
          ))}

          <InactiveCampaigns campaigns={grouped.false || []} renderer={Component} readOnly={readOnly}/>
        </Content>
        <Fence canEditCampaign>
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
