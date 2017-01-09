import React from 'react'
import {styled} from '../mixins/styled'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import Fence from '../Fence'
import Page from '../Page'
import {Container, BottomLine, ThumbLink, Gear, Cap} from '../ThumbLink'
import {DropdownMenu, MenuItem} from '../DropdownMenu'
import SubHeader, {SubHeaderButton} from '../SubHeader'
import {Link} from 'react-router'
import deburr from 'lodash/deburr'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import lowerCase from 'lodash/toLower'
import trim from 'lodash/trim'
import SearchBox from '../HeaderSearchBox'
import {DeleteSpan} from '../DeleteButton'
import {deleteReportAction} from '../../actions/delete-report'
import ShareButton from './ShareButton'
import csjs from 'csjs'

const style = csjs`
.descr {
  display: inline-block;
  font-size: x-small;
  line-height: 1.2em;
  height: calc(1.2em * 3);
  overflow: hidden;
  width: calc(100% - 30px);
}
.icon {
  float: right;
  padding-top: .4em;
}`

const cleanStr = str => trim(deburr(lowerCase(str)))

const I = ({icon, title}) => (
  <i className={`material-icons mdl-color-text--grey-600 ${style.icon}`} title={title}>{icon}</i>
)

I.propTypes = {
  icon: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
}

function Report ({dispatch, params, shareUrl, path, id, name, is_private, is_global, description}, {messages}) {
  let icon = <I icon='people' title={messages.companyReportTooltip}/>

  if (is_private) {
    icon = <I icon='lock' title={messages.privateReportTooltip}/>
  } else if (is_global) {
    icon = <I icon='public' title={messages.globalReportTooltip}/>
  }

  return (
    <ThumbLink to={`${path}/report/${id}`} title={name}>
      <Cap>{name}</Cap>
      <BottomLine>
        <div className={`${style.descr}`}>
          {description}
        </div>
        {icon}
      </BottomLine>
      <Fence canEditReport>{({canEditReport}) =>
        <Gear>
          <DropdownMenu>
            <ShareButton {...{id, shareUrl}}/>

            <MenuItem tag={Link} to={`${path}/report/${id}/mailing?skipEmptyList=true`} icon='mail_outline'>
              <Message>reportMailing</Message>
            </MenuItem>

            {canEditReport &&

            <MenuItem tag={Link} icon='mode_edit' to={`${path}/report/${id}/edit`}>
              <Message>editReport</Message>
            </MenuItem>}

            {canEditReport &&

            <MenuItem
              tag={DeleteSpan}
              entityName={name}
              icon='delete'
              onClick={() => dispatch(deleteReportAction, params, id)}>
              <Message>deleteReport</Message>
            </MenuItem>}
          </DropdownMenu>
        </Gear>}
      </Fence>
    </ThumbLink>
  )
}

Report.displayName = 'Report'
Report.propTypes = {
  id: React.PropTypes.string,
  shareUrl: React.PropTypes.string,
  path: React.PropTypes.string,
  name: React.PropTypes.string,
  description: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  is_private: React.PropTypes.bool,
  is_global: React.PropTypes.bool
}
Report.contextTypes = {
  messages: React.PropTypes.object.isRequired
}

export const Reports = React.createClass({
  displayName: 'Reports',
  mixins: [styled(style)],
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    reports: React.PropTypes.array,
    path: React.PropTypes.string
  },
  getInitialState () {
    return {
      searchValue: ''
    }
  },
  onChange (searchValue) {
    this.setState({searchValue})
  },
  render () {
    const searchValue = cleanStr(this.state.searchValue)
    const {reports, path, dispatch, params} = this.props
    const matchingReports = searchValue
      ? filter(reports, ({name}) => includes(cleanStr(name), searchValue))
      : reports

    return (
      <div>
        <SubHeader>
          <Fence canEditReport>
            <SubHeaderButton tag={Link} to={`${path}/reports/new`}>
              <i className='material-icons'>add</i>
              <Message>newReportHeader</Message>
            </SubHeaderButton>
          </Fence>
          <SearchBox onChange={this.onChange}/>
        </SubHeader>
        <Page>
          <Container>
            {map(matchingReports, (report, index) =>
              <Report
                key={index}
                {...report}
                dispatch={dispatch}
                params={params}
                path={path}/>)}
          </Container>
        </Page>
      </div>
    )
  }
})

export default Reports
