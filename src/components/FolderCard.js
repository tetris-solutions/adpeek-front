import Message from 'tetris-iso/Message'
import React from 'react'
import cx from 'classnames'
import {ThumbLink, Cap, Gear} from './ThumbLink'
import {DropdownMenu, MenuItem} from './DropdownMenu'
import {Link} from 'react-router'
import {prettyNumber} from '../functions/pretty-number'
import {deleteFolderAction} from '../actions/delete-folder'
import {loadFolderStatsAction} from '../actions/load-folder-stats'
import {DeleteSpan} from './DeleteButton'
import ReportLink from './Report/ReportLink'
import Highcharts from './Highcharts'
import map from 'lodash/map'
import csjs from 'csjs'
import {styled} from './mixins/styled'

const style = csjs`
.wrapper {
  height: 180px;
}
.chart {
  width: 230px;
  height: 150px;
}
.bt {
  font-size: 9pt;
  cursor: pointer;
  display: inline-block;
  padding: .3em .7em;
  color: #9e9e9e;
}
.bt:hover {
  background: rgba(0, 0, 0, 0.1)
}
.selected {
  color: #283593;
}`

const {PropTypes} = React
const dt = str => {
  const [year, month, day] = str.split('-')
  return new Date(year, month - 1, day)
}

const labelStyle = {
  fontSize: '10px'
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
    tree: PropTypes.object.isRequired,
    locales: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      selected: 'metric'
    }
  },
  componentDidMount () {
    this.setupFormatters()
    loadFolderStatsAction(
      this.context.tree,
      this.props.params,
      this.props.id
    )
  },
  setupFormatters () {
    const component = this

    this.labelFormatter = function () {
      const {locales} = component
      const {selected} = component.state
      const {stats} = component.props

      const metricView = selected === 'metric'
      const seriesType = metricView ? stats.metric.type : 'currency'

      return prettyNumber(this.value, seriesType, locales)
    }
    this.pointFormatter = function () {
      const {messages, locales} = component
      const {selected} = component.state
      const {stats} = component.props

      const metricView = selected === 'metric'
      const seriesType = metricView ? stats.metric.type : 'currency'
      const seriesName = metricView ? stats.metric.name : messages.investmentLabel

      const value = prettyNumber(this.y, seriesType, locales)
      return `<span style="color: ${this.color}">${seriesName}:</span> <b>${value}</b><br/>`
    }
  },
  selectMetric (e) {
    e.preventDefault()
    this.setState({selected: 'metric'})
  },
  selectBudget (e) {
    e.preventDefault()
    this.setState({selected: 'budget'})
  },
  render () {
    const {selected} = this.state
    const {stats} = this.props

    if (!stats || !stats.metric) {
      return (
        <div className={`${style.wrapper}`}/>
      )
    }

    const metricView = selected === 'metric'

    return (
      <div className={`${style.wrapper}`}>
        <span
          className={cx({
            [style.bt]: true,
            [style.selected]: !metricView
          })}
          onClick={this.selectBudget}>
          <Message>investmentLabel</Message>
        </span>

        <span
          className={cx({
            [style.bt]: true,
            [style.selected]: metricView
          })}
          onClick={this.selectMetric}>
          {stats.metric.name}
        </span>

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
            <labels style={labelStyle} formatter={this.labelFormatter}/>
          </y-axis>

          <line id={selected}>
            <tooltip pointFormatter={this.pointFormatter}/>
            {map(stats.series, (x, index) =>
              <point
                key={`${x.date}-${selected}-${index}`}
                id={`${x.date}-${selected}-${index}`}
                x={dt(x.date)}
                y={metricView
                  ? x[stats.metric.id]
                  : x.cost}/>)}
          </line>
        </Highcharts>
      </div>
    )
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

const FolderCard = ({id, account: {platform}, name, stats, reports, editable, dispatch, params}, {location: {query}}) => {
  const {company, workspace} = params
  const folderUrl = `/company/${company}/workspace/${workspace}/folder/${id}`

  return (
    <ThumbLink to={folderUrl} title={name}>
      <Cap bg={platform === 'adwords' ? 'amber-800' : 'blue-900'}>
        {name}
      </Cap>

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
  account: PropTypes.shape({
    platform: PropTypes.string
  }).isRequired,
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
