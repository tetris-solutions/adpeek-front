import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import {SubText} from '../Utils'

export const networkMessages = {
  google_search: 'googleSearchNetwork',
  search_network: 'searchNetwork',
  content_network: 'contentNetwork',
  partner_network: 'partnerNetwork',
  shopping_network: 'shoppingNetwork',
  multi_channel_network: 'multiChannelNetwork'
}

export const networkNames = [
  'google_search',
  'search_network',
  'content_network',
  'partner_network'
]

const Network = ({name}) => (
  <SubText>
    <Message>{networkMessages[name]}</Message>
  </SubText>
)

Network.displayName = 'Network'
Network.propTypes = {
  name: PropTypes.string
}

export default Network
