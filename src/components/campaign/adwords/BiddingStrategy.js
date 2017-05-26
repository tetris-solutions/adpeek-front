import React from 'react'
import PropTypes from 'prop-types'
import PrettyNumber from '../../PrettyNumber'
import {Italic, SubText} from '../Utils'
import camelCase from 'lodash/camelCase'

const BiddingStrategy = ({type, name, cpa, roas}, {messages}) => (
  <span>
    <SubText>
      {messages[camelCase(type) + 'Label'] || type}
    </SubText>

    {name ? (
      <Italic>({name})</Italic>
    ) : null}

    {cpa ? (
      <Italic>
        (CPA: <PrettyNumber type='currency'>{cpa}</PrettyNumber>)
      </Italic>
    ) : null}

    {roas ? (
      <Italic>
        (ROAS: <PrettyNumber type='currency'>{roas}</PrettyNumber>)
      </Italic>
    ) : null}
  </span>
)

BiddingStrategy.displayName = 'Bidding-Strategy'
BiddingStrategy.propTypes = {
  amount: PropTypes.number,
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  cpa: PropTypes.number,
  roas: PropTypes.number
}
BiddingStrategy.contextTypes = {
  messages: PropTypes.object.isRequired
}

export default BiddingStrategy
