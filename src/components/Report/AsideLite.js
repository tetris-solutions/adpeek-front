import React from 'react'
import {contextualize} from '../higher-order/contextualize'
import {Navigation, NavBts, Name} from '../Navigation'
import Icon from './Icon'
import ModulesIndex from './ModulesIndex'

const AsideLite = ({report}) => (
  <Navigation icon={<Icon {...report}/>}>
    <div>
      <Name>{report.name}</Name>

      {report.description &&
      <blockquote
        style={{fontSize: '10pt', margin: '0 2em'}}
        dangerouslySetInnerHTML={{__html: report.description.replace(/\n/g, '<br/>')}}/>}

      <hr/>
    </div>

    <NavBts>
      <ModulesIndex/>
    </NavBts>
  </Navigation>
)

AsideLite.displayName = 'Report-Aside-Lite'
AsideLite.propTypes = {
  report: React.PropTypes.object.isRequired
}

export default contextualize(AsideLite, 'report')
