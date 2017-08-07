import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import assign from 'lodash/assign'

export class EditLink extends React.Component {
  static displayName = 'Edit-Link'

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }

  static contextTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object
    }).isRequired
  }

  render () {
    const {query, pathname} = this.context.location
    const {name, value} = this.props
    const route = {
      pathname,
      query: assign({}, query, {
        [name]: value
      })
    }

    return (
      <Link to={route} {...omit(this.props, 'name', 'value')}/>
    )
  }
}

export class EditableCreative extends React.Component {
  static displayName = 'Editable-Creative'
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  static contextTypes = {
    router: PropTypes.shape({
      push: PropTypes.func
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object
    }).isRequired
  }

  static childContextTypes = {
    editMode: PropTypes.bool,
    isOpenModal: PropTypes.func,
    closeModal: PropTypes.func,
    getQueryParam: PropTypes.func
  }

  getChildContext () {
    return {
      editMode: this.editMode(),
      isOpenModal: this.isOpenModal,
      closeModal: this.closeModal,
      getQueryParam: this.getQueryParam
    }
  }

  editMode () {
    return this.context.location.pathname.includes('/edit')
  }

  isOpenModal = (name, expectedValue = null) => {
    return this.editMode() && (
      expectedValue
        ? String(expectedValue) === this.getQueryParam(name)
        : Boolean(this.getQueryParam(name))
    )
  }

  getQueryParam = name => {
    return this.context.location.query[name]
  }

  closeModal = name => {
    const {router, location: {pathname, query}} = this.context

    router.push({
      pathname: pathname,
      query: omit(query, name)
    })
  }

  render () {
    return this.props.children
  }
}
