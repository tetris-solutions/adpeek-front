import React from 'react'
import {loadRecentAction} from '../actions/load-recent'
import camelCase from 'lodash/camelCase'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styled} from './mixins/styled'
import {Link} from 'react-router'
import trimEnd from 'lodash/trimEnd'

const clean = str => trimEnd(str, '/')
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

const {PropTypes} = React

const Recent = React.createClass({
  displayName: 'Recent',
  mixins: [styled(style)],
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    icon: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired
  },
  contextTypes: {
    location: PropTypes.shape({
      pathname: PropTypes.string
    }).isRequired
  },
  getList () {
    return this.props.node[camelCase(`recent ${this.props.level}`)]
  },
  componentWillMount () {
    const {dispatch, params, level} = this.props

    dispatch(loadRecentAction, level, params)
  },
  render () {
    const {location: {pathname}} = this.context
    const {level, icon} = this.props

    return (
      <div className={String(style.box)}>
        <h6>
          <Message>{camelCase(`recent ${level}`)}</Message>
        </h6>

        {map(this.getList(), ({id, name}) =>
          <Link key={id} to={`${clean(pathname)}/${level}/${id}`} className={`mdl-color-text--grey-800 ${style.item}`}>
            <i className='material-icons'>{icon}</i>
            <span>{name}</span>
          </Link>)}
      </div>
    )
  }
})

export default Recent
