import React from 'react'
import ReactDOM from 'react-dom'

export function expandVertically (Component) {
  return class extends React.Component {
    static displayName = `ExpandVertically(${Component.displayName})`
    state = {height: null}

    componentDidMount () {
      this.calcHeight()
      window.addEventListener('resize', this.calcHeight)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.calcHeight)
    }

    calcHeight = () => {
      /**
       * @type {HTMLElement}
       */
      const el = ReactDOM.findDOMNode(this)

      this.setState({
        height: (
          el.parentNode.clientHeight - (
            el.getBoundingClientRect().top -
            el.parentNode.getBoundingClientRect().top
          )
        )
      })
    }

    render () {
      const {height} = this.state

      return height
        ? <Component {...this.props} height={height}/>
        : <span />
    }
  }
}
