import React from 'react'
import {loadRecentAction} from '../actions/load-recent'
import camelCase from 'lodash/camelCase'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import {Link} from 'react-router'
import compact from 'lodash/compact'

const style = csjs`
.box {
  margin: 0 8%;
}
.item {
  display: block;
  text-decoration: none;
  margin: 5px 10px;
  line-height: 2em;
  overflow: hidden;
  white-space: nowrap;
}
.item > i {
  display: inline-block;
}
.item > span {
  display: inline-block;
  margin-left: 1em;
  transform: translateY(-20%);
}`
const levels = ['company', 'workspace', 'folder', 'campaign', 'order', 'report']
const calcPath = params => compact(map(levels, name => params[name] && `${name}/${params[name]}`))
  .join('/')

const Recent = React.createClass({
  displayName: 'Recent',
  mixins: [styled(style)],
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    icon: React.PropTypes.string.isRequired,
    level: React.PropTypes.string.isRequired,
    node: React.PropTypes.object.isRequired
  },
  getList () {
    return this.props.node[camelCase(`recent ${this.props.level}`)]
  },
  componentDidMount () {
    const {dispatch, params, level} = this.props

    dispatch(loadRecentAction, level, params)
  },
  render () {
    const {level, params, icon} = this.props
    const path = calcPath(params)

    return (
      <div className={String(style.box)}>
        <h6>
          <Message>{camelCase(`recent ${level}`)}</Message>
        </h6>

        {map(this.getList(), ({id, name}) =>
          <Link
            key={id}
            title={name}
            to={`/${path}/${level}/${id}`}
            className={`mdl-color-text--grey-800 ${style.item}`}>

            <i className='material-icons'>{icon}</i>
            <span>{name}</span>
          </Link>)}
      </div>
    )
  }
})

export default Recent
