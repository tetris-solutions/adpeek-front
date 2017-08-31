import React from 'react'
import PropTypes from 'prop-types'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {styledFunctionalComponent} from '../higher-order/styled'
import loglevel from 'loglevel'
import {branchChildren} from '../higher-order/branch'
import {inferLevelFromProps} from '../../functions/infer-level-from-params'
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'
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
import Icon from './Icon'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import Switch from '../Switch'
import concat from 'lodash/concat'
import values from 'lodash/values'

const isCompanyShared = ({is_private, is_global}) => (
  !is_private && !is_global
)

const sorted = ls => orderBy(ls, ['is_default_report', 'creation'], ['desc', 'desc'])

function grouped (reports) {
  return {
    private: sorted(filter(reports, 'is_private')),
    company: sorted(filter(reports, isCompanyShared)),
    global: sorted(filter(reports, 'is_global'))
  }
}

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
}
.author {
  margin-bottom: .3em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.defaultReport { 
  text-align: center;
}
.defaultReport a {
  color: inherit;
  text-decoration: none
}
.defaultReport strong {
  text-decoration: underline
}
.update {
  font-size: x-small;
  position: absolute;
  margin-top: .5em;
  right: 1em;
}
.switch {
  float: right
}`

const cleanStr = str => trim(deburr(lowerCase(str)))

function Report (props, {moment}) {
  const {dispatch, params, shareUrl, path, id, name, author, last_update, description} = props

  return (
    <ThumbLink to={`${path}/r/${id}`} title={name}>
      <Cap>{name}</Cap>

      {last_update && <small className={`mdl-color-text--grey-500 ${style.update}`}>
        <Message timeago={moment(last_update).fromNow()}>updatedTimeAgo</Message>
      </small>}

      <BottomLine>
        {author && <div className={style.author}>
          <Message html name={author.name}>
            createdByName
          </Message>
        </div>}

        <div className={`mdl-color-text--grey-700 ${style.descr}`}>
          <em>{description}</em>
        </div>

        <Icon {...props} className={`mdl-color-text--grey-600 ${style.icon}`}/>
      </BottomLine>
      <Fence canEditReport>{({canEditReport}) =>
        <Gear>
          <DropdownMenu>
            <ShareButton {...{id, shareUrl}}/>

            <MenuItem tag={Link} to={`${path}/r/${id}/mailing?skipEmptyList=true`} icon='mail_outline'>
              <Message>reportMailing</Message>
            </MenuItem>

            {canEditReport &&

            <MenuItem tag={Link} icon='mode_edit' to={`${path}/r/${id}/edit`}>
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
  id: PropTypes.string,
  author: PropTypes.object,
  last_update: PropTypes.string,
  shareUrl: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  is_private: PropTypes.bool,
  is_global: PropTypes.bool
}
Report.contextTypes = {
  messages: PropTypes.object.isRequired,
  moment: PropTypes.func.isRequired
}

const safely = (fn, fallback) => (...args) => {
  try {
    return fn(...args)
  } catch (e) {
    loglevel.error(e)
    return fallback
  }
}

const showNativeReports = safely(
  () => window.localStorage.showNativeReports !== 'no',
  true
)

const setNativeReportsFlag = safely(val => {
  window.localStorage.showNativeReports = val
    ? 'yes'
    : 'no'
})

class Reports extends React.Component {
  static displayName = 'Reports'

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    reports: PropTypes.array,
    path: PropTypes.string
  }

  state = {
    searchValue: ''
  }

  onChange = (searchValue) => {
    this.setState({searchValue})
  }

  onSwitch = ({target: {checked}}) => {
    setNativeReportsFlag(checked)
    this.forceUpdate()
  }

  render () {
    const searchValue = cleanStr(this.state.searchValue)
    const {path, dispatch, params} = this.props

    const reports = searchValue
      ? filter(this.props.reports, ({name}) => includes(cleanStr(name), searchValue))
      : this.props.reports

    const sections = grouped(reports)

    const renderThumb = (report, index) =>
      <Report
        key={index}
        {...report}
        dispatch={dispatch}
        params={params}
        path={path}/>

    const defaultFlag = showNativeReports()

    if (!defaultFlag) {
      delete sections.global
    }

    const defaultReport = find(
      concat(...values(sections)),
      'is_default_report'
    )

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
            {defaultReport && (
              <p className={style.defaultReport}>
                <em>
                  <Link to={`${path}/r/${defaultReport.id}`}>
                    <Message html name={defaultReport.name}>
                      defaultReportLabel
                    </Message>
                  </Link>
                </em>
              </p>
            )}

            <span className={style.switch}>
              <Switch
                checked={defaultFlag}
                name='toggleGlobalReports'
                label={<Message>toggleGlobalReports</Message>}
                onChange={this.onSwitch}/>
            </span>

            {!isEmpty(sections.global) && (
              <h5>
                <Message>globalReports</Message>
              </h5>)}

            {!isEmpty(sections.global) && (
              map(sections.global, renderThumb))}

            {!isEmpty(sections.private) && (
              <h5>
                <Message>privateReports</Message>
              </h5>)}

            {!isEmpty(sections.private) && (
              map(sections.private, renderThumb))}

            {!isEmpty(sections.company) && (
              <h5>
                <Message>companyReports</Message>
              </h5>)}

            {!isEmpty(sections.company) && (
              map(sections.company, renderThumb))}
          </Container>
        </Page>
      </div>
    )
  }
}

const Wrapper = props =>
  <Reports {...props} path={'/' + (
    join(compact([
      `c/${props.params.company}`,
      props.params.workspace && `w/${props.params.workspace}`,
      props.params.folder && `f/${props.params.folder}`
    ]), '/')
  )}/>

Wrapper.displayName = 'Report-List-Wrapper'
Wrapper.propTypes = {
  reports: PropTypes.array,
  params: PropTypes.object
}

export default branchChildren(inferLevelFromProps, 'reports',
  styledFunctionalComponent(Wrapper, style))
