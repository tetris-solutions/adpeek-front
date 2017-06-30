import csjs from 'csjs'
import {Button, Submit} from '../../Button'
import forEach from 'lodash/forEach'
import Message from 'tetris-iso/Message'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Fence from '../../Fence'
import map from 'lodash/map'
import size from 'lodash/size'
import {Form, Content, Header, Footer} from '../../Card'
import {styledComponent} from '../../higher-order/styled'
import groupBy from 'lodash/groupBy'

const style = csjs`
.content {
  height: 50vh
}`

class InactiveCampaigns extends React.Component {
  static displayName = 'Inactive-Campaigns'

  static propTypes = {
    campaigns: PropTypes.array.isRequired,
    renderer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  }

  state = {
    isExpanded: false
  }

  toggle = () => {
    this.setState({isExpanded: !this.state.isExpanded})
  }

  render () {
    const {isExpanded} = this.state
    const {campaigns, readOnly, renderer: Component} = this.props
    const msgName = isExpanded ? 'hideNCampaigns' : 'showNCampaigns'
    const count = size(campaigns)

    if (!count) return null

    return (
      <section>
        <p style={{textAlign: 'center'}}>
          <Button className='mdl-button' onClick={this.toggle}>
            <Message count={String(count)}>{msgName}</Message>
          </Button>
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
}

class FolderCampaignsSelector extends React.Component {
  static displayName = 'Campaigns-Selector'

  static propTypes = {
    campaigns: PropTypes.array.isRequired,
    renderer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    headerColor: PropTypes.string,
    headerTextColor: PropTypes.string,
    title: PropTypes.node,
    label: PropTypes.string,
    onSelected: PropTypes.func
  }

  static contextTypes = {
    messages: PropTypes.shape({
      selectAll: PropTypes.string,
      deselectAll: PropTypes.string
    })
  }

  static defaultProps = {
    headerColor: 'primary',
    headerTextColor: 'white'
  }

  state = {
    selected: false,
    activeOnly: false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const values = []

    function serializeValue ({checked, value}) {
      if (checked) {
        values.push(JSON.parse(value))
      }
    }

    forEach(e.target.elements, serializeValue)

    if (!values.length) return

    this.setState({selected: false})
    this.props.onSelected(values)
  }

  toggleAll = (e) => {
    e.preventDefault()

    const form = ReactDOM.findDOMNode(this.refs.form)
    const {selected} = this.state
    const methodName = selected
      ? 'programaticallyUncheck'
      : 'programaticallyCheck'

    function toggleCheckBox (el) {
      if (typeof el[methodName] === 'function') {
        el[methodName]()
      }
    }

    forEach(form.elements, toggleCheckBox)

    this.setState({selected: !selected})
  }

  render () {
    const {selected} = this.state
    const {messages: {selectAll, deselectAll}} = this.context
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
          <Footer>
            {isLoading && (
              <Button disabled className='mdl-button mdl-button--colored mdl-color-text--grey-600'>
                <Message>loadingCampaigns</Message>
              </Button>)}

            {!isLoading && (
              <Submit className='mdl-button mdl-button--colored'>
                {label}
              </Submit>)}

            {!isLoading && (
              <a onClick={this.toggleAll} className='mdl-button mdl-button--colored'>
                {selected ? deselectAll : selectAll}
              </a>)}
          </Footer>
        </Fence>
      </Form>
    )
  }
}

export default styledComponent(FolderCampaignsSelector, style)
