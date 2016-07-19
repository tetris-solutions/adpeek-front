import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {styled} from './mixins/styled'
import csjs from 'csjs'
import pick from 'lodash/pick'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import assign from 'lodash/assign'

const {PropTypes} = React
const style = csjs`
.full {
  width: 100%;
  height: 100%;
}
.wrapper extends .full {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6;
  background: rgba(0, 0, 0, 0.5);
}
.relativeLayer extends .full {
  position: relative;
}
.content {
  position: relative;
  background: white;
    
  width: 40%;
  min-width: 300px;
  height: auto;
  min-height: 300px;
  max-height: 80%;
  
  margin: 0 auto;
  top: 50%;
  
  transform: translateY(-50%);
  transition: transform 1s ease;
  
  overflow-x: hidden;
  overflow-y: auto;
}`

const createPortal = contextAttributes => {
  if (typeof window === 'undefined') return () => null

  let modalClassCfg, contextTypes

  if (!isEmpty(contextAttributes)) {
    contextTypes = {}

    forEach(contextAttributes, key => {
      contextTypes[key] = PropTypes.any
    })

    modalClassCfg = {
      displayName: `Modal(${contextAttributes.join(', ')})`,
      childContextTypes: contextTypes,
      getChildContext () {
        return pick(this.props, contextAttributes)
      }
    }
  }

  const Modal = React.createClass(assign({
    displayName: 'Modal',
    propTypes: {
      children: PropTypes.node.isRequired
    },
    render () {
      return (
        <div className={`${style.relativeLayer}`}>
          <div className={`${style.content}`}>
            <div className='mdl-grid'>
              <div className='mdl-cell mdl-cell--12-col'>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }, modalClassCfg))

  const previousOverflow = document.body.style.overflow
  const wrapper = document.createElement('div')

  document.body.style.overflow = 'hidden'
  wrapper.className = `animated fadeIn ${style.wrapper}`
  document.body.appendChild(wrapper)

  return React.createClass({
    displayName: 'Portal',
    contextTypes,
    propTypes: {
      children: PropTypes.node.isRequired
    },
    componentWillUnmount () {
      document.body.style.overflow = previousOverflow
      unmountComponentAtNode(wrapper)
      document.body.removeChild(wrapper)
    },
    renderModal () {
      render((
        <Modal {...this.context}>
          {this.props.children}
        </Modal>
      ), wrapper)
    },
    componentDidMount () {
      this.renderModal()
    },
    componentDidUpdate () {
      this.renderModal()
    },
    render () {
      return null
    }
  })
}

const ModalSpawner = React.createClass({
  displayName: 'Modal-Spawner',
  mixins: [styled(style)],
  propTypes: {
    children: PropTypes.node.isRequired,
    provide: PropTypes.array
  },
  componentWillMount () {
    this.Portal = createPortal(this.props.provide)
  },
  render () {
    const {Portal} = this

    return (
      <Portal>
        {this.props.children}
      </Portal>
    )
  }
})

export default ModalSpawner
