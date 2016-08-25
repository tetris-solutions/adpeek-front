import csjs from 'csjs'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
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
.item > strong {
  cursor: pointer
}
.item > i {
  cursor: pointer;
  float: left;
  padding-right: .3em
}
.item > div {
  margin-left: .7em;
}`

const EntityGroup = React.createClass({
  displayName: 'Entity-Group',
  propTypes: {
    ids: PropTypes.array,
    name: PropTypes.string,
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
    const {children, name} = this.props

    return (
      <li className={String(style.item)}>
        <i onClick={this.toggleVisibility} className='material-icons'>{
          isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
        }</i>
        <strong onClick={this.toggleSelection}>
          {name}
        </strong>
        <div>
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
    attributes: PropTypes.array.isRequired,
    entity: reportEntityType.isRequired,
    entities: PropTypes.arrayOf(reportEntityType).isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired
  },
  render () {
    const {addItem, removeItem, entity, attributes} = this.props
    const entityId = lowerCase(entity.id)
    const entities = keyBy(this.props.entities, lowerCaseId)

    if (entityId === 'campaign') {
      return (
        <Attributes {...this.props}/>
      )
    }

    let nodes

    if (entityId === 'adgroup' || entityId === 'adset') {
      nodes = map(groupBy(attributes, 'campaign_id'), (ls, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})
        const ids = map(ls, 'id')

        return (
          <EntityGroup key={campaign.id} name={campaign.name} ids={ids} select={addItem} unselect={removeItem}>
            <Attributes {...this.props} attributes={ls} title={null}/>
          </EntityGroup>
        )
      })
    }

    if (entityId === 'ad' || entityId === 'keyword') {
      const adGroups = map(groupBy(attributes, 'adgroup_id'), (ls, adGroupId) => {
        const adGroup = find(entities.adgroup.list, {id: adGroupId})
        const ids = map(ls, 'id')

        return {
          ids,
          parent: adGroup.campaign_id,
          content: (
            <EntityGroup key={adGroup.id} name={adGroup.name} ids={ids} select={addItem} unselect={removeItem}>
              <Attributes {...this.props} attributes={ls} title={null}/>
            </EntityGroup>
          )
        }
      })

      nodes = map(groupBy(adGroups, 'parent'), (ls, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})
        const ids = flatten(map(ls, 'ids'))

        return (
          <EntityGroup key={campaign.id} name={campaign.name} ids={ids} select={addItem} unselect={removeItem}>
            <ul className={String(style.list)}>
              {map(ls, ({content}) => content)}
            </ul>
          </EntityGroup>
        )
      })
    }

    return (
      <ul className={String(style.list)}>
        {nodes}
      </ul>
    )
  }
})

export default EntityList
