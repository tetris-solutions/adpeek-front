import React from 'react'
import PropTypes from 'prop-types'
import compact from 'lodash/compact'
import join from 'lodash/join'
import {styledFunctionalComponent} from '../higher-order/styled'
import {collection} from '../higher-order/branch'
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
.update {
  font-size: x-small;
  position: absolute;
  margin-top: .5em;
  right: 1em;
}`

const cleanStr = str => trim(deburr(lowerCase(str)))

function Report (props, {moment}) {
  const {dispatch, params, shareUrl, path, id, name, author, last_update, description} = props

  return (
    <ThumbLink to={`${path}/report/${id}`} title={name}>
      <Cap>{name}</Cap>

      {last_update && <small className={`mdl-color-text--grey-500 ${style.update}`}>
        <Message timeago={moment(last_update).fromNow()}>updatedTimeAgo</Message>
      </small>}

      <BottomLine>
        {author && <div className={`${style.author}`}>
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
          <Container>{map(orderBy(matchingReports, ['creation'], ['desc']), (report, index) =>
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
}

const Wrapper = props =>
  <Reports {...props} path={'/' + (
    join(compact([
      `company/${props.params.company}`,
      props.params.workspace && `workspace/${props.params.workspace}`,
      props.params.folder && `folder/${props.params.folder}`
    ]), '/')
  )}/>

Wrapper.displayName = 'Report-List-Wrapper'
Wrapper.propTypes = {
  reports: PropTypes.array,
  params: PropTypes.object
}

export default collection(inferLevelFromProps, 'reports',
  styledFunctionalComponent(Wrapper, style))
