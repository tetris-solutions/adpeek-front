import React from 'react'
import {loadRecentAction} from '../actions/load-recent'
import camelCase from 'lodash/camelCase'
import map from 'lodash/map'

const {PropTypes} = React

const Recent = React.createClass({
  displayName: 'Recent',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    icon: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired
  },
  contextTypes: {
    params: PropTypes.object
  },

  getList () {
    return this.props.node[camelCase(`recent ${this.props.level}`)]
  },
  componentWillMount () {
    const {dispatch, params, level} = this.props

    dispatch(loadRecentAction, level, params)
  },
  render () {
    return (
      <div>
        <h6>
          Últimos acessos:
        </h6>

        {map(this.getList(), ({id, name}) =>
          <div key={id}>
            <i className='material-icons'>{this.props.icon}</i>
            {name}
          </div>)}
      </div>
    )
  }
})

export default Recent
