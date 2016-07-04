import React from 'react'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import Middle from './VerticalAlign'

const style = csjs`
.wrapper {
  height: 70vh;
  width: 500px;
  max-width: 100%;
  margin: 0 auto;
}
.wrapper p {
  color: rgb(100, 100, 100);
  margin-top: 1em;
  text-align: center;
  font-size: smaller;
}
.wrapper > div {
  height: 100%;
}`

export const LoadingHorizontal = React.createClass({
  displayName: 'Loading-Horizontal',
  mixins: [styled(style)],
  propTypes: {
    children: React.PropTypes.node
  },
  componentDidMount () {
    window.componentHandler.upgradeElement(this.refs.prog)
  },
  render () {
    const {children} = this.props
    return (
      <div className={`${style.wrapper}`}>
        <Middle>
          <div>
            <div ref='prog' className='mdl-progress mdl-js-progress mdl-progress__indeterminate'/>
            {children ? <p>{children}</p> : null}
          </div>
        </Middle>
      </div>
    )
  }
})

export default LoadingHorizontal
