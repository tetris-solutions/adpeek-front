import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Spinner from './Spinner'
import {branch} from './higher-order/branch'
import {styledComponent} from './higher-order/styled'
import {runningActionCounter} from '../functions/intercept-preload'

import csjs from 'csjs'

const style = csjs`
.float {
  display: inline-block;
  position: fixed;
  bottom: 10px;
  right: 30px;
  height: auto;
  width: auto;
  z-index: 6;
}
.relative {
  position: relative;
}`

const hidden = {display: 'none'}

const Loading = ({running}) => (
  <div className={`${style.relative}`} style={running ? undefined : hidden}>
    <Spinner/>
  </div>
)

Loading.displayName = 'Loading'
Loading.propTypes = {
  running: PropTypes.number
}

class Wrapper extends React.Component {
  static displayName = 'Loading-Wrapper'

  static propTypes = {
    running: PropTypes.number
  }

  componentDidMount () {
    this.container = document.createElement('div')
    this.container.classList.add(String(style.float))

    document.body.appendChild(this.container)
  }

  componentDidUpdate () {
    this.draw()
  }

  draw = () => {
    ReactDOM.render(
      <Loading running={this.props.running}/>,
      this.container
    )
  }

  render () {
    return null
  }
}

export default branch({running: [runningActionCounter]},
  styledComponent(Wrapper, style))
