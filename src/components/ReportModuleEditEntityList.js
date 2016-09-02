import csjs from 'csjs'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import intersec from 'lodash/intersection'
import keyBy from 'lodash/keyBy'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import Message from '@tetris/front-server/lib/components/intl/Message'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import Attributes from './ReportModuleEditAttributes'
import {styled} from './mixins/styled'

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
    unselect: PropTypes.func
  },
  getInitialState () {
    return {
      isOpen: true,
      isSelected: false
    }
  },
  toggleVisibility () {
    this.setState({isOpen: !this.state.isOpen})
  },
  toggleSelection () {
    const {isSelected} = this.state

    if (isSelected) {
      this.props.unselect(this.props.ids)
    } else {
      this.props.select(this.props.ids)
    }

    this.setState({isSelected: !isSelected})
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
  render () {
    const {selectedAttributes, addItem, removeItem, entity, attributes} = this.props
    const entityId = lowerCase(entity.id)
    const entities = keyBy(this.props.entities, lowerCaseId)
    const ids = map(attributes, 'id')
    let subList

    if (entityId === 'campaign') {
      subList = <Attributes {...this.props}/>
    }

    if (entityId === 'adgroup' || entityId === 'adset') {
      subList = map(groupBy(attributes, 'campaign_id'), (ls, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})
        const ids = map(ls, 'id')
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

            <Attributes {...this.props} attributes={ls}/>
          </EntityGroup>
        )
      })
    }

    if (entityId === 'ad' || entityId === 'keyword') {
      const parentEntity = entities.adgroup ? 'adgroup' : 'adset'
      const adGroups = map(groupBy(attributes, `${parentEntity}_id`), (ls, adGroupId) => {
        const adGroup = find(entities[parentEntity].list, {id: adGroupId})
        const ids = map(ls, 'id')
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

              <Attributes {...this.props} attributes={ls}/>
            </EntityGroup>
          )
        }
      })

      subList = map(groupBy(adGroups, 'parent'), (ls, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})
        const ids = flatten(map(ls, 'ids'))
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
              {map(ls, ({content}) => content)}
            </ul>
          </EntityGroup>
        )
      })
    }

    const localSelection = intersec(ids, selectedAttributes)
    let selection
    if (localSelection.length) {
      selection = localSelection.length === ids.length ? 'total' : 'partial'
    }

    return (
      <ul className={String(style.list)}>
        <EntityGroup
          selection={selection}
          name={<Message>all</Message>}
          ids={ids}
          select={addItem}
          unselect={removeItem}>
          {subList}
        </EntityGroup>
      </ul>
    )
  }
})

export default EntityList
