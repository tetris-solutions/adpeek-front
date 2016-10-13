import csjs from 'csjs'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import intersec from 'lodash/intersection'
import keyBy from 'lodash/keyBy'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import Message from 'tetris-iso/Message'
import React from 'react'
import get from 'lodash/get'
import filter from 'lodash/filter'
import reportEntityType from '../propTypes/report-entity'
import Attributes from './ReportModuleEditAttributes'
import {styled} from './mixins/styled'
import compact from 'lodash/compact'

const isCampaignActive = campaign => get(campaign, 'status.is_active')
const {PropTypes} = React
const lowerCaseId = ({id}) => lowerCase(id)
const style = csjs`
.list {
  list-style: none;
  padding-left: 0;
}
.total {
  color: #004465
}
.partial {
  color: #4650a0
}
.item {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item > strong {
  cursor: pointer;
}
.item > i {
  cursor: pointer;
  float: left;
  padding-right: .3em
}
.subTree {
  margin-left: .7em;
}`

const EntityGroup = React.createClass({
  displayName: 'Entity-Group',
  propTypes: {
    selection: PropTypes.string,
    ids: PropTypes.array,
    name: PropTypes.node,
    children: PropTypes.node,
    select: PropTypes.func,
    unselect: PropTypes.func,
    openByDefault: PropTypes.bool
  },
  getDefaultProps () {
    return {
      openByDefault: false
    }
  },
  getInitialState () {
    return {
      isOpen: this.props.openByDefault
    }
  },
  toggleVisibility () {
    this.setState({isOpen: !this.state.isOpen})
  },
  toggleSelection () {
    const {selection} = this.props

    if (selection === 'total') {
      this.props.unselect(this.props.ids)
    } else {
      this.props.select(this.props.ids)
    }
  },
  render () {
    const {isOpen} = this.state
    const {children, name, selection} = this.props

    return (
      <li>
        <header className={`${style.item} ${selection ? style[selection] : ''}`}>
          <i onClick={this.toggleVisibility} className='material-icons'>{
            isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
          }</i>
          <strong onClick={this.toggleSelection}>
            {name}
          </strong>
        </header>
        <div className={`${style.subTree}`}>
          {isOpen ? children : null}
        </div>
      </li>
    )
  }
})

const EntityList = React.createClass({
  displayName: 'Entity-List',
  mixins: [styled(style)],
  propTypes: {
    selectedAttributes: PropTypes.array,
    attributes: PropTypes.array.isRequired,
    entity: reportEntityType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      activeOnly: true
    }
  },
  toggle () {
    this.setState({activeOnly: !this.state.activeOnly})
  },
  render () {
    const {activeOnly} = this.state
    const {selectedAttributes, addItem, removeItem, entity, attributes} = this.props
    const entityId = lowerCase(entity.id)
    const entities = keyBy(this.props.entities, lowerCaseId)
    const ids = map(attributes, 'id')
    let innerList

    if (entityId === 'campaign') {
      innerList = (
        <Attributes
          {...this.props}
          attributes={activeOnly ? filter(attributes, isCampaignActive) : attributes}
        />
      )
    }

    if (entityId === 'adgroup' || entityId === 'adset') {
      const renderCampaignEntityGroup = (adGroupList, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})

        if (activeOnly && !isCampaignActive(campaign)) {
          return null
        }

        const ids = map(adGroupList, 'id')
        const localSelection = intersec(ids, selectedAttributes)
        let selection
        if (localSelection.length) {
          selection = localSelection.length === ids.length ? 'total' : 'partial'
        }
        return (
          <EntityGroup
            openByDefault
            selection={selection}
            key={campaign.id}
            name={campaign.name}
            ids={ids}
            select={addItem}
            unselect={removeItem}>

            <Attributes {...this.props} attributes={adGroupList}/>
          </EntityGroup>
        )
      }

      innerList = compact(map(groupBy(attributes, 'campaign_id'), renderCampaignEntityGroup))
    }

    if (entityId === 'ad' || entityId === 'keyword') {
      const parentEntity = entities.adgroup ? 'adgroup' : 'adset'
      const renderAdGroupEntityGroup = (adOrKeywordList, adGroupId) => {
        const adGroup = find(entities[parentEntity].list, {id: adGroupId})
        const ids = map(adOrKeywordList, 'id')
        const localSelection = intersec(ids, selectedAttributes)
        let selection
        if (localSelection.length) {
          selection = localSelection.length === ids.length ? 'total' : 'partial'
        }
        return {
          ids,
          parent: adGroup.campaign_id,
          content: (
            <EntityGroup
              selection={selection}
              key={adGroup.id}
              name={adGroup.name}
              ids={ids}
              select={addItem}
              unselect={removeItem}>

              <Attributes {...this.props} attributes={adOrKeywordList}/>
            </EntityGroup>
          )
        }
      }
      const adGroups = map(groupBy(attributes, `${parentEntity}_id`), renderAdGroupEntityGroup)
      const renderSubCampaignEntityGroup = (adGroupList, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})

        if (activeOnly && !isCampaignActive(campaign)) {
          return null
        }

        const ids = flatten(map(adGroupList, 'ids'))
        const localSelection = intersec(ids, selectedAttributes)
        let selection
        if (localSelection.length) {
          selection = localSelection.length === ids.length ? 'total' : 'partial'
        }
        return (
          <EntityGroup
            selection={selection}
            key={campaign.id}
            name={campaign.name}
            ids={ids}
            select={addItem}
            unselect={removeItem}>

            <ul className={String(style.list)}>
              {map(adGroupList, 'content')}
            </ul>
          </EntityGroup>
        )
      }

      innerList = compact(map(groupBy(adGroups, 'parent'), renderSubCampaignEntityGroup))
    }

    const localSelection = intersec(ids, selectedAttributes)
    let selection

    if (localSelection.length) {
      selection = localSelection.length === ids.length ? 'total' : 'partial'
    }

    return (
      <div>
        <p style={{textAlign: 'right'}}>
          <button type='button' className='mdl-button' onClick={this.toggle}>
            <Message>{activeOnly ? 'showAllInactiveCampaigns' : 'hideAllInactiveCampaigns'}</Message>
          </button>
        </p>
        <ul className={String(style.list)}>
          <EntityGroup
            openByDefault
            selection={selection}
            name={<Message>all</Message>}
            ids={ids}
            select={addItem}
            unselect={removeItem}>
            <ul className={String(style.list)}>
              {innerList}
            </ul>
          </EntityGroup>
        </ul>
      </div>
    )
  }
})

export default EntityList
