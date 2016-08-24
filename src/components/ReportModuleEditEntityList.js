import find from 'lodash/find'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import lowerCase from 'lodash/toLower'
import map from 'lodash/map'
import React from 'react'

import reportEntityType from '../propTypes/report-entity'
import Attributes from './ReportModuleEditAttributes'

const {PropTypes} = React
const lowerCaseId = ({id}) => lowerCase(id)

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
    const {children, name} = this.props

    return (
      <li>
        <p>
          <small>
            <i onClick={this.toggleVisibility} className='material-icons'>keyboard_arrow_right</i>
          </small>
          <strong onClick={this.toggleSelection}>
            {name}
          </strong>
        </p>
        {this.state.isOpen ? children : null}
      </li>
    )
  }
})

const EntityList = React.createClass({
  displayName: 'Entity-List',
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
        <Attributes title={entity.name} attributes={attributes} {...this.props}/>
      )
    }

    let nodes

    if (entityId === 'adgroup' || entityId === 'adset' || entityId === 'keyword') {
      nodes = null
    }

    if (entityId === 'ad') {
      const adGroups = map(groupBy(attributes, 'adgroup_id'), (ls, adGroupId) => {
        const adGroup = find(entities.adgroup.list, {id: adGroupId})
        const ids = map(ls, 'id')

        return {
          ids,
          parent: adGroup.campaign_id,
          content: (
            <EntityGroup key={adGroup.id} name={adGroup.name} ids={ids} select={addItem} unselect={removeItem}>
              <Attributes attributes={ls} {...this.props}/>
            </EntityGroup>
          )
        }
      })

      nodes = map(groupBy(adGroups, 'parent'), (ls, campaignId) => {
        const campaign = find(entities.campaign.list, {id: campaignId})
        const ids = flatten(map(ls, 'ids'))

        return (
          <EntityGroup key={campaign.id} name={campaign.name} ids={ids} select={addItem} unselect={removeItem}>
            <ul>
              {map(ls, ({content}) => content)}
            </ul>
          </EntityGroup>
        )
      })
    }

    return (
      <ul>
        {nodes}
      </ul>
    )
  }
})

export default EntityList
