import React from 'react'
import PropTypes from 'prop-types'
import {routeParamsBasedBranch} from '../higher-order/branch'
import {inferLevelFromProps} from '../../functions/infer-level-from-params'
import {Navigation, NavBts, NavBt} from '../Navigation'
import Message from '@tetris/front-server/Message'
import Icon from './Icon'
import {Modules} from './ModulesIndex'
import {withState} from 'recompose'
import ReportAsideHeader from './AsideHeader'

const enhance = withState('indexMode', 'setIndexMode', false)

const AsideLite = ({report, indexMode, setIndexMode}) => (
  <Navigation icon={<Icon {...report}/>}>
    <ReportAsideHeader report={report}/>
    {indexMode
      ? <Modules {...report} exit={() => setIndexMode(false)}/>
      : (
        <NavBts>
          <NavBt icon='list' onClick={() => setIndexMode(true)}>
            <Message>moduleIndexLabel</Message>
          </NavBt>
        </NavBts>)}
  </Navigation>
)

AsideLite.displayName = 'Report-Aside-Lite'
AsideLite.propTypes = {
  report: PropTypes.object.isRequired,
  indexMode: PropTypes.bool,
  setIndexMode: PropTypes.func
}

export default routeParamsBasedBranch(inferLevelFromProps, 'report', enhance(AsideLite))
