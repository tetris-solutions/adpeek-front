import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import omit from 'lodash/omit'
import startsWith from 'lodash/startsWith'

class BreadcrumbLink extends React.PureComponent {
  static displayName = 'Breadcrumb-Link'

  static propTypes = {
    to: PropTypes.string
  }

  static contextTypes = {
    location: PropTypes.object
  }

  render () {
    if (startsWith(this.context.location.pathname, '/share/')) {
      return (
        <a href={this.props.to} {...omit(this.props, 'to')}/>
      )
    }

    return <Link {...this.props}/>
  }
}

export default BreadcrumbLink
