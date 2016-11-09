import csjs from 'csjs'
import find from 'lodash/find'
import size from 'lodash/size'
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
import reportEntityType from '../../../../propTypes/report-entity'
import AttributesSelect from './AttributesSelect'
import {styled} from '../../../mixins/styled'
import compact from 'lodash/compact'
import not from 'lodash/negate'

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

const EntityTree = React.createClass({
  displayName: 'Entity-Tree',
  mixins: [styled(style)],
  propTypes: {
    items: PropTypes.arrayOf(PropTypes.object)
  },
  contextTypes: {
    draft: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired,
    entity: reportEntityType.isRequired,
    addEntity: PropTypes.func.isRequired,
    removeEntity: PropTypes.func.isRequired
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
    const {items} = this.props
    const {draft: {module, entity}, addEntity, removeEntity} = this.context
    const {activeOnly} = this.state
    const selectedAttributes = module.filters.id
    const entityId = lowerCase(entity.id)
    const entities = keyBy(this.context.entities, lowerCaseId)
    const ids = map(items, 'id')

    let inactiveCampaignCount = 0
    let innerList

    if (entityId === 'campaign' || entityId === 'placement') {
      inactiveCampaignCount += size(map(filter(items, not(isCampaignActive)), 'id'))

      innerList = (
        <AttributesSelect
          selectedAttributes={selectedAttributes}
          add={addEntity}
          remove={removeEntity}
          attributes={activeOnly ? filter(items, isCampaignActive) : items}/>
      )
    }

    if (entityId === 'adgroup' || entityId === 'adset') {
      const renderCampaignEntityGroup = (adGroupList, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})

        if (!isCampaignActive(campaign)) {
          inactiveCampaignCount++
          if (activeOnly) return null
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
            select={addEntity}
            unselect={removeEntity}>

            <AttributesSelect
              selectedAttributes={selectedAttributes}
              add={addEntity}
              remove={removeEntity}
              attributes={adGroupList}/>
          </EntityGroup>
        )
      }

      innerList = compact(map(groupBy(items, 'campaign_id'), renderCampaignEntityGroup))
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
              select={addEntity}
              unselect={removeEntity}>

              <AttributesSelect
                selectedAttributes={selectedAttributes}
                add={addEntity}
                remove={removeEntity}
                attributes={adOrKeywordList}/>
            </EntityGroup>
          )
        }
      }
      const adGroups = map(groupBy(items, `${parentEntity}_id`), renderAdGroupEntityGroup)
      const renderSubCampaignEntityGroup = (adGroupList, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})

        if (!isCampaignActive(campaign)) {
          inactiveCampaignCount++
          if (activeOnly) return null
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
            select={addEntity}
            unselect={removeEntity}>

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
        {inactiveCampaignCount > 0 && (
          <p style={{textAlign: 'right'}}>
            <button type='button' className='mdl-button' onClick={this.toggle}>
              <Message count={String(inactiveCampaignCount)}>
                {activeOnly ? 'showNCampaigns' : 'hideNCampaigns'}
              </Message>
            </button>
          </p>)}

        <ul className={String(style.list)}>
          <EntityGroup
            openByDefault
            selection={selection}
            name={<Message>all</Message>}
            ids={ids}
            select={addEntity}
            unselect={removeEntity}>
            <ul className={String(style.list)}>
              {innerList}
            </ul>
          </EntityGroup>
        </ul>
      </div>
    )
  }
})

export default EntityTree
