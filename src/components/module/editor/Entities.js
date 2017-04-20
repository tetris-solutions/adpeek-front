import find from 'lodash/find'
import React from 'react'
import PropTypes from 'prop-types'
import AttributeList from './AttributeList'
import FilterSwitch from './FilterSwitch'

class Entities extends React.Component {
  static contextTypes = {
    report: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    draft: PropTypes.object.isRequired,
    addEntity: PropTypes.func.isRequired,
    removeEntity: PropTypes.func.isRequired
  }

  static propTypes = {
    entities: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired
  }

  getFolderLevel = () => {
    return {
      id: 'folder',
      openByDefault: false,
      mount ({folder, campaign}) {
        return folder || campaign.folder
      }
    }
  }

  getWorkspaceLevel = () => {
    return {
      id: 'workspace',
      openByDefault: true,
      mount ({workspace, campaign}) {
        return workspace || campaign.workspace
      }
    }
  }

  getPlatformLevel = () => {
    const {messages} = this.context

    return {
      id: 'platform',
      openByDefault: true,
      mount ({platform}) {
        return {
          id: platform,
          name: messages[platform + 'Level']
        }
      }
    }
  }

  getCampaignLevel = ({Campaign}) => {
    return {
      id: 'campaign',
      mount ({adgroup, adset, campaign_id}) {
        return find(Campaign.list, {
          id: campaign_id || (adset || adgroup).campaign_id
        })
      }
    }
  }

  getAdGroupLevel = ({AdGroup}) => {
    return {
      id: 'adgroup',
      mount ({adgroup_id}) {
        return find(AdGroup.list, {id: adgroup_id})
      }
    }
  }

  getAdSetLevel = ({AdSet}) => {
    return {
      id: 'adset',
      mount ({adset_id}) {
        return find(AdSet.list, {id: adset_id})
      }
    }
  }

  getTopLevel = () => {
    const {messages} = this.context

    return {
      id: 'top',
      openByDefault: true,
      mount () {
        return {
          id: 'all',
          name: messages.all
        }
      }
    }
  }

  getLevels = () => {
    const {entities} = this.props
    const {draft: {entity}, report} = this.context

    switch (entity.id) {
      case 'Placement':
      case 'Campaign':
        if (report.level === 'company') {
          return [
            this.getTopLevel(),
            this.getWorkspaceLevel(entities),
            this.getPlatformLevel(),
            this.getFolderLevel(entities)
          ]
        }

        if (report.level === 'workspace') {
          return [
            this.getTopLevel(),
            this.getPlatformLevel(),
            this.getFolderLevel(entities)
          ]
        }

        return [this.getTopLevel()]
      case 'AdSet':
      case 'Search':
      case 'Audience':
      case 'Video':
      case 'AdGroup':
      case 'Location':
        return [this.getTopLevel(), this.getCampaignLevel(entities)]
      case 'Ad':
        return [
          this.getTopLevel(),
          this.getCampaignLevel(entities),
          report.platform === 'facebook'
            ? this.getAdSetLevel(entities)
            : this.getAdGroupLevel(entities)
        ]
      case 'Keyword':
        return [
          this.getTopLevel(),
          this.getCampaignLevel(entities),
          this.getAdGroupLevel(entities)
        ]
    }
  }

  render () {
    const {draft: {module}, addEntity, removeEntity} = this.context
    const {items} = this.props

    return (
      <div>
        <FilterSwitch/>
        <br/>

        <AttributeList
          levels={this.getLevels()}
          attributes={items}
          selectedAttributes={module.filters.id}
          remove={removeEntity}
          add={addEntity}/>
      </div>
    )
  }
}

export default Entities
