import Message from 'tetris-iso/Message'
import React from 'react'
import {ThumbLink, Cap, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import {deleteFolderAction} from '../actions/delete-folder'
import {loadFolderStatsAction} from '../actions/load-folder-stats'
import {DeleteSpan} from './DeleteButton'
import ReportLink from './Report/ReportLink'
import Highcharts from './Highcharts'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.chart {
  width: 230px;
  height: 150px;
}`

const {PropTypes} = React
const dt = str => {
  const [year, month, day] = str.split('-')
  return new Date(year, month - 1, day)
}

const labelStyle = {
  fontSize: '10px'
}
const Chart = ({metric, series}) => (
  <Highcharts className={String(style.chart)}>
    <title>{null}</title>

    <plot-options>
      <line>
        <marker enabled={false}>
          <states>
            <hover enabled={false}/>
          </states>
        </marker>
      </line>
    </plot-options>

    <legend enabled={false}/>
    <tooltip enabled={false}/>

    <x-axis>
      <type>datetime</type>
      <title>{null}</title>
      <labels style={labelStyle}/>
    </x-axis>

    <y-axis>
      <title>{null}</title>
      <labels style={labelStyle}/>
    </y-axis>

    <line id='budget'>
      {map(series, ({date, budget}, index) =>
        <point
          key={`budget-${date}`}
          id={`budget-${date}`}
          y={budget}
          x={dt(date)}/>)}
    </line>
  </Highcharts>
)

Chart.displayName = 'Folder-Card-Chart'
Chart.propTypes = {
  metric: PropTypes.object,
  series: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string
  })).isRequired
}

const FolderStats = React.createClass({
  displayName: 'Folder-Stats',
  mixins: [styled(style)],
  propTypes: {
    id: PropTypes.string,
    params: PropTypes.object,
    stats: PropTypes.object
  },
  contextTypes: {
    tree: PropTypes.object
  },
  componentDidMount () {
    loadFolderStatsAction(
      this.context.tree,
      this.props.params,
      this.props.id
    )
  },
  render () {
    const {stats} = this.props

    return stats
      ? (
        <div>
          <Chart {...stats}/>
        </div>
      ) : null
  }
})

const DeleteFolder = ({params, dispatch, id, name}) => (
  <MenuItem
    icon='delete'
    tag={DeleteSpan}
    onClick={() => dispatch(deleteFolderAction, params, id)}
    entityName={name}>
    <Message>deleteFolder</Message>
  </MenuItem>
)
DeleteFolder.displayName = 'Delete-Folder'
DeleteFolder.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const FolderCard = ({id, name, stats, reports, editable, dispatch, params}, {location: {query}}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`

  return (
    <ThumbLink to={folderUrl} title={name}>
      <Cap>{name}</Cap>

      {query.stats && (
        <FolderStats
          params={params}
          stats={stats}
          id={id}/>)}

      <Gear>
        <DropdownMenu>
          <MenuItem to={`${folderUrl}/creatives`} tag={Link} icon='receipt'>
            <Message>creatives</Message>
          </MenuItem>

          <MenuItem to={`${folderUrl}/orders`} tag={Link} icon='attach_money'>
            <Message>folderOrders</Message>
          </MenuItem>

          <ReportLink
            tag={MenuItem}
            params={{company, workspace, folder: id}}
            reports={reports}
            dispatch={dispatch}>
            <Message>folderReport</Message>
          </ReportLink>

          {editable &&
          <MenuItem to={`${folderUrl}/edit`} tag={Link} icon='mode_edit'>
            <Message>editFolder</Message>
          </MenuItem>}

          {editable &&
          <DeleteFolder
            id={id}
            name={name}
            params={params}
            dispatch={dispatch}/>}

        </DropdownMenu>
      </Gear>
    </ThumbLink>
  )
}

FolderCard.displayName = 'FolderCard'
FolderCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stats: PropTypes.object,
  reports: PropTypes.array,
  editable: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
}

FolderCard.contextTypes = {
  location: PropTypes.object.isRequired
}

export default FolderCard
