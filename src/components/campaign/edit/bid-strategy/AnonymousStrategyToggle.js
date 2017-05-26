import React from 'react'
import PropTypes from 'prop-types'
import Message from 'tetris-iso/Message'
import SharedStrategy from './SharedStrategy'
import {Button} from '../../../Button'

class AnonymousStrategyToggle extends React.PureComponent {
  static displayName = 'Anonymous-Strategy-Toggle'
  static propTypes = {
    strategyId: PropTypes.string,
    update: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  state = {
    useSharedStrategy: Boolean(this.props.strategyId)
  }

  disableSharedStrategy = () => {
    this.setState({useSharedStrategy: false})
    this.props.update({
      strategyId: null,
      strategyName: null
    })
  }

  enableSharedStrategy = () => {
    this.setState({useSharedStrategy: true})
    this.props.update({
      strategyId: null
    })
  }

  render () {
    const {useSharedStrategy} = this.state

    if (useSharedStrategy) {
      return (
        <div>
          <SharedStrategy {...this.props}/>

          {this.props.children}

          <br/>
          <Button className='mdl-button' onClick={this.disableSharedStrategy}>
            <Message>disableSharedStrategy</Message>
          </Button>
        </div>
      )
    }

    return (
      <div>
        {this.props.children}

        <br/>
        <Button className='mdl-button' onClick={this.enableSharedStrategy}>
          <Message>enableSharedStrategy</Message>
        </Button>
      </div>
    )
  }
}

export default AnonymousStrategyToggle
