import React from 'react'
import PropTypes from 'prop-types'
import Message from '@tetris/front-server/Message'
import SharedStrategy from './SharedStrategy'
import {Button} from '../../../Button'

export const enableAnonymous = BiddingScheme => class AnonymousStrategyToggle extends React.PureComponent {
  static displayName = `enableAnonymous(${BiddingScheme.displayName})`

  static propTypes = {
    strategyId: PropTypes.string,
    useSharedStrategy: PropTypes.bool,
    update: PropTypes.func.isRequired
  }

  toggle = () => {
    this.props.update({
      useSharedStrategy: !this.props.useSharedStrategy
    })
  }

  render () {
    const {useSharedStrategy} = this.props

    return (
      <div>
        {useSharedStrategy ? (
          <SharedStrategy {...this.props}>
            <BiddingScheme {...this.props}/>
          </SharedStrategy>
        ) : (
          <BiddingScheme {...this.props}/>
        )}

        <br/>
        <Button className='mdl-button' onClick={this.toggle}>
          {useSharedStrategy
            ? <Message>disableSharedStrategy</Message>
            : <Message>enableSharedStrategy</Message>}
        </Button>
      </div>
    )
  }
}
