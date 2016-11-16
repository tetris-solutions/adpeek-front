import find from 'lodash/find'
import keyBy from 'lodash/keyBy'
import React from 'react'
import get from 'lodash/get'
import AttributeList from './AttributeList'

const {PropTypes} = React

const Entities = React.createClass({
  contextTypes: {
    messages: PropTypes.object.isRequired,
    draft: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired,
    addEntity: PropTypes.func.isRequired,
    removeEntity: PropTypes.func.isRequired
  },
  propTypes: {
    items: PropTypes.array.isRequired
  },
  getFolderLevel ({Campaign}) {
    return {
      openByDefault: true,
      getId ({folder: {id}}) {
        return id
      },
      getName (id) {
        return get(find(Campaign.list, ({folder}) => folder.id === id), 'folder.name', id)
      }
    }
  },
  getWorkspaceLevel ({Campaign}) {
    return {
      openByDefault: true,
      getId ({workspace: {id}}) {
        return id
      },
      getName (id) {
        return get(find(Campaign.list, ({workspace}) => workspace.id === id), 'workspace.name', id)
      }
    }
  },
  getPlatformLevel () {
    const {messages} = this.context

    return {
      openByDefault: true,
      getId ({platform}) {
        return platform
      },
      getName (platform) {
        return messages[platform + 'Level']
      }
    }
  },
  getCampaignLevel ({Campaign}) {
    return {
      getId ({campaign_id}) {
        return campaign_id
      },
      getName (id) {
        return get(find(Campaign.list, {id}), 'name', id)
      }
    }
  },
  getTopLevel () {
    const {messages} = this.context

    return {
      openByDefault: true,
      getId () {
        return 'all'
      },
      getName () {
        return messages.all
      }
    }
  },
  getLevels () {
    const {draft: {entity}} = this.context
    const entities = keyBy(this.context.entities, 'id')

    switch (entity.id) {
      case 'Campaign':
        return [
          this.getTopLevel(),
          this.getWorkspaceLevel(entities),
          this.getPlatformLevel(),
          this.getFolderLevel(entities)
        ]
      case 'AdSet':
      case 'AdGroup':
      case 'Ad':
      case 'Keyword':
      case 'Placement':
        return []
    }
  },
  render () {
    const {draft: {module}, addEntity, removeEntity} = this.context
    const {items} = this.props

    return (
      <AttributeList
        levels={this.getLevels()}
        attributes={items}
        selectedAttributes={module.filters.id}
        remove={removeEntity}
        add={addEntity}/>
    )
  }
})

export default Entities
