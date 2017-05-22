import React from 'react'
import PropTypes from 'prop-types'
import {loadRecentAction} from '../actions/load-recent'
import camelCase from 'lodash/camelCase'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import csjs from 'csjs'
import {styledComponent} from './higher-order/styled'
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

class Recent extends React.Component {
  static displayName = 'Recent'

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    icon: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired
  }

  getList = () => {
    return this.props.node[camelCase(`recent ${this.props.level}`)]
  }

  componentDidMount () {
    const {dispatch, params, level} = this.props

    dispatch(loadRecentAction, level, params)
  }

  render () {
    const {level, params, icon} = this.props
    const path = calcPath(params)

    return (
      <div className={style.box}>
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
}

export default styledComponent(Recent, style)
