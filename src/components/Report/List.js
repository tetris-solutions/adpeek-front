import React from 'react'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import Fence from '../Fence'
import Page from '../Page'
import {Container, Title, ThumbLink, Gear} from '../ThumbLink'
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

const cleanStr = str => trim(deburr(lowerCase(str)))
const {PropTypes} = React

const Report = ({dispatch, params, path, id, name}) => (
  <ThumbLink to={`${path}/report/${id}`} title={name}>
    <Title>{name}</Title>
    <Fence canEditReport>{({canEditReport}) =>
      <Gear>
        <DropdownMenu>
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

Report.displayName = 'Report'
Report.propTypes = {
  id: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

export const Reports = React.createClass({
  displayName: 'Reports',
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    reports: PropTypes.array,
    path: PropTypes.string
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
