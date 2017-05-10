import React from 'react'
import PropTypes from 'prop-types'
import PrettyNumber from '../../PrettyNumber'
import {Italic, SubText} from '../Utils'
import camelCase from 'lodash/camelCase'

function BiddingStrategy ({type, name, cpa, roas}, {messages}) {
  let label

  if (name) {
    label = <span>{name}</span>
  } else {
    const labelName = camelCase(type) + 'Label'
    label = messages[labelName] || type
  }

  return (
    <span>
      <SubText>{label}</SubText>

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
}

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
