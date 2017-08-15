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
    location: PropTypes.object,
    isReportAuthorized: PropTypes.bool
  }

  render () {
    const {location: {pathname}, isReportAuthorized} = this.context

    if (startsWith(pathname, '/share/')) {
      const props = omit(this.props, 'to')

      return isReportAuthorized
        ? <a href={this.props.to} {...props}/>
        : <span {...props}/>
    }

    return <Link {...this.props}/>
  }
}

export default BreadcrumbLink
