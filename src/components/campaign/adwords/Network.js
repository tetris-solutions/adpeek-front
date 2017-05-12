import React from 'react'
import Message from 'tetris-iso/Message'
import PropTypes from 'prop-types'
import keys from 'lodash/keys'
import {SubText} from '../Utils'

export const networkMessages = {
  google_search: 'googleSearchNetwork',
  search_network: 'searchNetwork',
  content_network: 'contentNetwork',
  partner_network: 'partnerNetwork'
}

export const networkNames = keys(networkMessages)

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
