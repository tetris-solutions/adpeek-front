import csjs from 'csjs'
import map from 'lodash/map'
import React from 'react'
import PropTypes from 'prop-types'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'
import {styledComponent} from './higher-order/styled'

const style = csjs`
.wrapper {
  max-width: 60%;
  white-space: nowrap;
  overflow-x: hidden;
}
.breadcrumb {
  display: inline-block;
  padding: 0 1em;
}
.breadcrumb:empty {
  display: none;
}
.breadcrumb a {
  font-weight: bold;
  color: white !important;
  text-decoration: none !important;
}
.breadcrumb i {
  float: left;
  margin-top: -.1em;
  margin-right: .3em;
}`

class Breadcrumbs extends React.Component {
  static displayName = 'Breadcrumbs'

  static contextTypes = {
    params: PropTypes.object,
    routes: PropTypes.array
  }

  static propTypes = {
    title: PropTypes.node
  }

  componentDidMount () {
    /**
     * @type {HTMLElement} wrapper
     */
    const {wrapper} = this.refs

    wrapper.scrollLeft = wrapper.scrollWidth - wrapper.clientWidth
  }

  render () {
    const {title} = this.props
    const {params, routes} = this.context
    const breadcrumbs = flatten(compact(map(routes, 'breadcrumb')))

    return (
      <span className={style.wrapper} ref='wrapper'>
        {map(breadcrumbs, (Breadcrumb, index) => (
          <span key={index} className={style.breadcrumb}>
            <Breadcrumb params={params}/>
          </span>))}

        {title
          ? <span className={style.breadcrumb}>{title}</span>
          : null}
      </span>
    )
  }
}

export default styledComponent(Breadcrumbs, style)
