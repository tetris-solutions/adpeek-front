import React from 'react'
import {node} from '../higher-order/branch'
import {inferLevelFromParams} from '../../functions/infer-level-from-params'
import {Navigation, NavBts, NavBt} from '../Navigation'
import Message from 'tetris-iso/Message'
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
  report: React.PropTypes.object.isRequired,
  indexMode: React.PropTypes.bool,
  setIndexMode: React.PropTypes.func
}

export default node(({params}) => inferLevelFromParams(params), 'report', enhance(AsideLite))
