import React from 'react'
import {contextualize} from '../higher-order/contextualize'
import {Navigation, Name} from '../Navigation'

const AsideLite = ({report}) => (
  <Navigation icon='trending_up'>
    <Name>{report.name}</Name>

    {report.description &&
    <blockquote
      style={{fontSize: '9pt', margin: '0 2em'}}
      dangerouslySetInnerHTML={{__html: report.description.replace(/\n/g, '<br/>')}}/>}
  </Navigation>
)

AsideLite.displayName = 'Report-Aside-Lite'
AsideLite.propTypes = {
  report: React.PropTypes.object.isRequired
}

export default contextualize(AsideLite, 'report')
