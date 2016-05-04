import React from 'react'
import forEach from 'lodash/forEach'
import settle from 'promise-settle'

const {PropTypes} = React

export const CampaignsToggle = React.createClass({
  displayName: 'CampaignListToggle',
  propTypes: {
    label: PropTypes.string,
    children: PropTypes.node,
    action: PropTypes.func,
    after: PropTypes.func
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

    const {after, action} = this.props

    settle(values.map(action)).then(after)
  },
  render () {
    return (
      <form onSubmit={this.handleSubmit}>

        <button type='submit' className='mdl-button mdl-js-button'>
          {this.props.label}
        </button>

        <hr/>

        <ul className='mdl-list'>
          {this.props.children}
        </ul>
      </form>
    )
  }
})

export default CampaignsToggle
