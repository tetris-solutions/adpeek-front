import debounce from 'lodash/debounce'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import React from 'react'
import moduleType from '../../../propTypes/report-module'
import reportEntityType from '../../../propTypes/report-entity'
import reportParamsType from '../../../propTypes/report-params'
import ModuleCard from './Card'
import {deleteModuleAction} from '../../../actions/delete-module'
import {loadReportModuleResultAction} from '../../../actions/load-report-module-result'
import {updateModuleAction} from '../../../actions/update-module'
import Editor from './Editor/Controller'
import Modal from 'tetris-iso/Modal'
import DeleteButton from '../../DeleteButton'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {Button} from '../../Button'
import Comments from './Comments'

const {PropTypes} = React
const reportContext = [
  'report',
  'reportParams',
  'entities',
  'changeDateRange',
  'entity',
  'attributes',
  'module',
  'activeOnly',
  'toggleActiveOnly',
  'getUsedAccounts'
]

const getAccountKeyFromId = id => id.substr(0, id.lastIndexOf(':'))

const ModuleController = React.createClass({
  displayName: 'Module-Controller',
  propTypes: {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    module: moduleType.isRequired,
    attributes: PropTypes.object.isRequired,
    entity: reportEntityType.isRequired
  },
  contextTypes: {
    messages: PropTypes.object.isRequired,
    report: PropTypes.object.isRequired,
    reportParams: reportParamsType.isRequired
  },
  childContextTypes: {
    entity: reportEntityType,
    attributes: PropTypes.object,
    module: PropTypes.object,
    getUsedAccounts: PropTypes.func
  },
  getChildContext () {
    return {
      entity: this.props.entity,
      attributes: this.props.attributes,
      module: this.props.module,
      getUsedAccounts: this.getUsedAccounts
    }
  },
  getInitialState () {
    return {
      editMode: (
        Boolean(this.props.editable) &&
        isEmpty(this.props.module.metrics)
      )
    }
  },
  componentDidMount () {
    this.fetchResult = debounce(this.startResultLoadingAction, 1000)
    this.fetchResult(this.getChartQuery())
  },
  componentDidUpdate () {
    this.fetchResult(this.getChartQuery())
  },
  startResultLoadingAction (query) {
    if (!query) return

    const {params, dispatch, module, attributes} = this.props

    return dispatch(loadReportModuleResultAction, params, module.id, query, attributes)
  },
  getChartQuery () {
    const {reportParams} = this.context
    const {module, entity} = this.props

    return {
      metrics: module.metrics,
      dimensions: module.dimensions,
      to: reportParams.to,
      from: reportParams.from,
      accounts: this.getUsedAccounts(module.filters.id),
      filters: module.filters,
      entity: entity.id
    }
  },
  getUsedAccounts (ids) {
    const {report: {platform}, reportParams: {accounts}} = this.context

    if (platform) {
      return accounts
    }

    const usedAccountKeys = uniq(map(ids, getAccountKeyFromId))

    return filter(accounts, ({id}) => includes(usedAccountKeys, id))
  },
  remove () {
    const {params, dispatch, module} = this.props

    return dispatch(deleteModuleAction, params, module.id)
  },
  save (moduleChanges, persistChanges) {
    const {params, dispatch, module} = this.props

    return dispatch(updateModuleAction, params, module.id, moduleChanges, persistChanges)
  },
  openModal () {
    this.setState({editMode: true})
  },
  closeModal () {
    this.setState({editMode: false})
  },
  render () {
    const {params, dispatch, module, editable} = this.props

    return (
      <ModuleCard>
        <div className='mdl-card__menu'>
          <Comments {...{dispatch, module, params}}/>

          {editable ? (
            <Button className='mdl-button mdl-button--icon' onClick={this.openModal}>
              <i className='material-icons'>create</i>
            </Button>) : null}

          {editable ? (
            <DeleteButton
              className='mdl-button mdl-button--icon'
              onClick={this.remove}
              entityName={module.name || this.context.messages.untitledModule}>
              <i className='material-icons'>clear</i>
            </DeleteButton>) : null}
        </div>

        {this.state.editMode && (
          <Modal size='huge' provide={reportContext}>
            <Editor save={this.save} close={this.closeModal}/>
          </Modal>
        )}

      </ModuleCard>
    )
  }
})

export default ModuleController
